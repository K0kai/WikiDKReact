import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../AuthContext";
import type { CategoryFilter } from "../../context/ArticleContext";
import { CategoryContext } from "../../context/CategoryContext";
import type { Article } from "../../types/article";
import type { Category } from "../../types/category";
import type { ArticleGroup } from "../../types/articleGroup";
import { ArticleGroupContext } from "../../context/ArticleGroupContext";
import "./ArticleForm.css"

function GroupCheckBox({ group, defaultChecked, style, onCheck }: { group: ArticleGroup, defaultChecked: boolean, style: string, onCheck: (id : number) => void }) {

    return <>
        <div className={style}>
            <label>{group.title}</label>
            <input type="checkbox" onChange={() => onCheck(group.id)} defaultChecked={defaultChecked} />
            

        </div>
    </>

}

function GroupCheckBoxes({ article, groupStyle , checkBoxStyle, onCheckedGroupsChange }: { article: Article | null, groupStyle: string, checkBoxStyle: string, onCheckedGroupsChange: (groups: number[]) => void }) {
    const articleGroupContext = useContext(ArticleGroupContext);
    if (!articleGroupContext)
        throw new Error("Article group context can't be null");
    const [containingGroups, setContainingGroups] = useState(articleGroupContext.groupItems.filter(x => x.articleId == article?.id).map(y => y.articleGroupId));

    function handleCheck(id :number){
         setContainingGroups(prev => {
                const next = new Set(prev)
                if (!next.has(id))
                    next.add(id)
                else
                    next.delete(id)

                onCheckedGroupsChange(Array.from(next));

                return Array.from(next);
            })
    }

    try {
        return <div className={groupStyle}>
            {articleGroupContext.groups.map(g => <GroupCheckBox key={g.id} group={g} style={checkBoxStyle}  defaultChecked={containingGroups.includes(g.id)} onCheck={(id) => handleCheck(id)} />)}
        </div>
    }
    catch (Err) {
        console.error(Err)
    }

}

function CategoryCheckBoxes({ article, onCheckedFiltersChanged }: { article: Article | null, onCheckedFiltersChanged: (checkedFilters: Set<number>) => void }) {
    try {
        const [filters, setFilters] = useState<Set<number>>(new Set(article?.categories))
        const catContext = useContext(CategoryContext);
        if (!catContext)
            throw new Error("Category context can't be null");
        const categories = catContext.categories

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
            {categories.map(cat => { return <CategoryBox key={cat.id} defaultCheckState={article?.categories.includes(cat.id) ?? false} category={cat} isChecked={(filter) => { handleFilterChange(filter) }} /> })}
        </div>

    }
    catch (err) {
        console.error(err);
    }

}






function CategoryBox({ category, defaultCheckState, isChecked }: { category: Category, defaultCheckState: boolean, isChecked: (filter: CategoryFilter) => void }) {
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
            <div className="grid g8005">
                <div>
                    <img className="smallicon margin-right15" src={category.icon} />
                    <label className="fontmsmall" htmlFor={`${category.name}_${category.id.toString()}`}>{category.name}</label>

                </div>
                <div>
                    <input id={id} type="checkbox" defaultChecked={defaultCheckState} onChange={handleChange} />
                </div>
            </div>
        </>



    } catch (err) {
        console.error(err)
    }
}

export type ArticleFormData = {
    title: string,
    content: string,
    thumbnailLink: string,
    categories: number[],
    groups: number[]
}


function ArticleForm(
    { article, onSubmit, onDiscard, onPreview }:
        { article: Article | null, onSubmit: (articleFormData: ArticleFormData) => Promise<void>, onDiscard: () => void, onPreview: () => void }
) {
    var authContext = useContext(AuthContext);
    var artGroupContext = useContext(ArticleGroupContext)
    const [hasPermission, setPermission] = useState<boolean>(false);
    const [title, setTitle] = useState(article?.title)
    const [content, setContent] = useState(article?.content)
    const [thumbnailLink, setThumbnailLink] = useState(article?.thumbnailLink);
    const [checkedCategories, setCheckedCategories] = useState<number[]>(article?.categories ?? [])
    const [checkedGroups, setCheckedGroups] = useState<number[]>(artGroupContext?.groupItems.filter(gi => gi.articleId == article?.id).map(x => x.articleGroupId) ?? [])


    useEffect(() => {

        async function loadArticle() {
            setPermission(authContext?.hasRole(1) ?? false);
        }

        loadArticle();

    }, [authContext, article]);



    function SaveDiscardButtons({ onSubmit, onDiscard, onPreview }: { onSubmit: () => void, onDiscard: () => void, onPreview: () => void }) {
        return <div className="btns-container">
            <button className="bigbutton noborder pthover semitransparent save" onClick={onSubmit}>Salvar</button>
            <button className="bigbutton noborder pthover semitransparent discard" onClick={onDiscard}>Descartar</button>
            <button className="bigbutton noborder pthover semitransparent preview" onClick={onPreview}>Preview</button>
        </div>
    }

    function handleSave() {
        if (title && content && thumbnailLink && checkedCategories) {
            const formData: ArticleFormData = {
                title: title,
                content: content,
                thumbnailLink: thumbnailLink,
                categories: checkedCategories,
                groups: checkedGroups
            }
            onSubmit(formData);
        }
    }


    return (
        <>
            {hasPermission ? (
                <>
                    {
                        <div className="mainContainer">
                            <p>Titulo:</p>
                            <br />
                            <input type="text" onChange={e => setTitle(e.target.value)} defaultValue={article?.title} id="title" className="title-input gbluebg noborder" />
                            <p className="subt-small">Titulo original:</p>
                            <p className="subt-small">{article?.title}</p>
                            <br />
                            <p>Link da Thumbnail:</p>
                            <input type="text" onChange={e => setThumbnailLink(e.target.value)} defaultValue={article?.thumbnailLink} id="thumbLink" className="link-input gbluebg noborder" />
                            <img id='thumbPreview' className="previewImage" src={thumbnailLink} />
                            <br />
                            <br />
                            <textarea defaultValue={article?.content} onChange={e => setContent(e.target.value)} id="content" className="content-input gbluebg noborder" />
                            <br />
                            <p className="margin-down20">Se encaixa em:</p>
                            <CategoryCheckBoxes article={article ?? null} onCheckedFiltersChanged={(checkedCategories) => setCheckedCategories(Array.from(checkedCategories))} />
                           
                            <div className="groupBoxes">
                                 <p className="margin-down20 ">Mostrar em:</p>
                                <GroupCheckBoxes article={article ?? null} groupStyle={"posright50"} checkBoxStyle="grid g5005" onCheckedGroupsChange={(groups) => setCheckedGroups(groups)} />
                            </div>
                            

                            <SaveDiscardButtons onSubmit={handleSave} onDiscard={onDiscard} onPreview={onPreview} />
                        </div>
                    }

                </>) : (<><p>Unauthorized</p></>)
            }
        </>
    )
}

export default ArticleForm