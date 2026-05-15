import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Article } from "../types/article";
import type { Category } from "../types/category";
import './ArticlesPage.css';
import plus from "../assets/plus.png"
import { type ArticleFilter, type CategoryFilter } from "../context/ArticleContext";
import plusCalendarIcon from "../assets/calendar_plus_icon.png"
import clockCalendarIcon from "../assets/clock-date-calendar-icon.png"
import { useQuery } from "@tanstack/react-query";
import { createPaginatedArticleQueryOptions } from "./query_options/articleQueryOptions";
import { createCategoryQueryOptions } from "./query_options/categoryQueryOptions";



function ArticleCard({ article }: { article: Article }) {
    const navigate = useNavigate();

    return (
        <div key={article.id} className="article-card">
            <div id="clickableArea" onClick={() => navigate(`/article/${article.id}`)}>
            <h2 >{article.title}</h2>
            <img src={article.thumbnailLink ?? null} alt="Article Thumbnail" className="article-thumb" />
            <br />
            </div>
            <div id="datetimes">
                <div className="flex side-by-side gap20 align-center">
                    <img title="Data de atualização" className="whitetint smallicon " src={clockCalendarIcon} />
                    <p className="fontsmall">{new Date(article.updated).toLocaleString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <div className="flex side-by-side gap20 align-center">
                    <img title="Data de criação" className="whitetint smallicon " src={plusCalendarIcon} />
                    <p className="fontsmall">{new Date(article.created).toLocaleString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <CategoryIconDisplays categoryIds={article.categories} />              

            </div>

        </div>
    );
}

function ArticlesPage() {
    const navigate = useNavigate();

    
    const [filter, setFilter] = useState<ArticleFilter>({page: 1, pageSize: 10, categoryFilters: [], dateSortType:1});
    const {data, isLoading} = useQuery(createPaginatedArticleQueryOptions(filter))

    return (
        <div >
            <HeaderNavigationDropdown />
            <FiltersPanel filter={filter} onFiltersChange={(f) => {setFilter(prev => ({
                ...prev,
                categoryFilters:f.categoryFilters,
                dateSortType:f.dateSortType,
                page:f.page,
                pageSize:f.pageSize
            }))}} />
            <div className="grid2fr">
                <div className="articles-pageview">
                    <NewArticleButton onClick={() => { navigate("/article/create") }} />
                        {isLoading ? (<div className="th-loader"><img className="mediumicon" src="https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/ring-resize-white-36.svg"/></div>) : (<>{data?.map(article => <ArticleCard key={article.id} article={article} />)}</>)}                    
                </div>
            </div>
        </div>
    )
}

function CategoryIconDisplays({ categoryIds }: { categoryIds: number[] }) {
    const {data} = useQuery(createCategoryQueryOptions())
    const categories = data?.filter(x => categoryIds.includes(x.id)) ?? []
    return <div className="flex side-by-side align-center gap10">
        {categories.map(cat => <img key={cat.id} className="smallicon" src={cat.icon} />)}
    </div>

}

function NewArticleButton({ onClick }: { onClick: () => void }) {
    return <div className="flex article-card greenhover justify-content-center">
        <button onClick={onClick} className="nobg noborder pthover">
            <img className="graytint xbigimage" src={plus} />
        </button>

    </div>
}

function FiltersPanel({ filter, onFiltersChange }: {filter : ArticleFilter, onFiltersChange:(filter : ArticleFilter) => void}) {
    return <div className="flex gap40">
        <CategoryFilterBoxes
            onCheckedFiltersChanged={(filters) => {filter.categoryFilters = Array.from(filters); onFiltersChange(filter)}} />
        <DateFilterButtons onCheckedDateFilterChanged={(dateFilter) => {filter.dateSortType = dateFilter; onFiltersChange(filter)}} />
    </div>
}

function DateFilterButtons({ onCheckedDateFilterChanged }: { onCheckedDateFilterChanged: (dateFilter: number) => void }) {
    try {

        function handleCheck(e: React.ChangeEvent<HTMLInputElement>, sortType: number) {
            if (e.target.checked)
                onCheckedDateFilterChanged(sortType);
        }

        return <div className="date-radio-buttons flex column">
            <h3>Data:</h3>
            <br />
            <div>
                <div>
                    <input onChange={(e) => handleCheck(e, 1)} name="date" type="radio" />
                    <label>Recém-atualizados</label>
                </div>
                <div>
                    <input onChange={(e) => handleCheck(e, 2)} name="date" type="radio" />
                    <label>Previamente atualizados</label>
                </div>
                <div>
                    <input onChange={(e) => handleCheck(e, 4)} name="date" type="radio" />
                    <label>Mais novos</label>
                </div>
                <div>
                    <input onChange={(e) => handleCheck(e, 3)} name="date" type="radio" />
                    <label>Mais antigos</label>
                </div>
            </div>

        </div>
    }
    catch (err) {
        console.error(err);
    }
}



function CategoryFilterBoxes({ onCheckedFiltersChanged }: { onCheckedFiltersChanged: (checkedFilters: Set<number>) => void }) {
    try {
        const [filters, setFilters] = useState<Set<number>>(new Set())
        const {data} = useQuery(createCategoryQueryOptions())
        filters;

        function handleFilterChange(filter: CategoryFilter) {
            setFilters(prev => {
                const next = new Set(prev)
                if (filter.value)
                    next.add(filter.id)
                else
                    next.delete(filter.id)

                onCheckedFiltersChanged(next);

                return next;
            })
        }

        return <div id="editor-category-filters" className="category-filters">
            <h3>Categoria:</h3>
            <br />
            <>{data?.map(cat => <CategoryBox key={cat.id} category={cat} isChecked={(filter) => { handleFilterChange(filter) }} />)}</>
        </div>

    }
    catch (err) {
        console.error(err);
    }

}






function CategoryBox({ category, isChecked }: { category: Category, isChecked: (filter: CategoryFilter) => void }) {
    try {
        let id = `${category.name}_${category.id.toString()}`;
        function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
            const filter: CategoryFilter = {
                id: category.id,
                value: e.target.checked
            };

            isChecked(filter);
        }
        return <>
            <div className="flex side-by-side gap20">
                <div>
                    <input id={id} type="checkbox" onChange={handleChange} />
                </div>
                <div>
                    <img className="smallicon margin-right15" src={category.icon} />
                    <label className="fontmsmall" htmlFor={`${category.name}_${category.id.toString()}`}>{category.name}</label>
                </div>

            </div>
        </>



    } catch (err) {
        console.error(err)
    }
}



function HeaderNavigationDropdown() {
    return (
        <div className="strip">

            <div id="search" className="search-container flex side-by-side">
                <p>Pesquisar:</p>
                <input disabled className="widebar margin-left-10" type="text" placeholder="Não implementado..." />


            </div>

        </div>
    )
}

export default ArticlesPage;