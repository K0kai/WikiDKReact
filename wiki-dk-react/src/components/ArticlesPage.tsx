import { useState, useContext, useEffect } from "react";
import { CategoryContext } from "../context/CategoryContext";
import { useNavigate } from "react-router-dom";
import type { Article } from "../types/article";
import type { Category } from "../types/category";
import './ArticlesPage.css';
import plus from "../assets/plus.png"
import { ArticleContext, type ArticleFilter, type CategoryFilter } from "../context/ArticleContext";
import plusCalendarIcon from "../assets/calendar_plus_icon.png"
import clockCalendarIcon from "../assets/clock-date-calendar-icon.png"



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
                    <img className="whitetint smallicon " src={clockCalendarIcon} />
                    <p className="fontsmall">{new Date(article.updated).toLocaleString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <div className="flex side-by-side gap20 align-center">
                    <img className="whitetint smallicon " src={plusCalendarIcon} />
                    <p className="fontsmall">{new Date(article.created).toLocaleString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <CategoryIconDisplays categoryIds={article.categories} />              

            </div>

        </div>
    );
}

function ArticlesPage() {
    const navigate = useNavigate();
    const artContext = useContext(ArticleContext);
    if (!artContext)
        throw new Error("Article context can't be null");

    const searchedArticles = artContext.searchedArticles
    const [filter, setFilter] = useState<ArticleFilter>(artContext.currentFilter);

    useEffect(() => {
        artContext.setFilter(filter)
        console.log(filter);
    },[filter])

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
                    {searchedArticles.map(article => <ArticleCard key={article.id} article={article} />)}
                </div>
            </div>
        </div>
    )
}

function CategoryIconDisplays({ categoryIds }: { categoryIds: number[] }) {
    const categoryContext = useContext(CategoryContext);
    if (!categoryContext)
        throw new Error("Category context can't be null")
    const categories = categoryContext.categories.filter(x => categoryIds.includes(x.id))
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
        const catContext = useContext(CategoryContext);
        if (!catContext)
            throw new Error("Category context can't be null");
        const categories = catContext.categories
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
            <>{categories.map(cat => <CategoryBox key={cat.id} category={cat} isChecked={(filter) => { handleFilterChange(filter) }} />)}</>
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