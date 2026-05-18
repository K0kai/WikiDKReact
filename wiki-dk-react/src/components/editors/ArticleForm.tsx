import { useState, useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import type { Article, CategoryFilter } from "../../types/article";
import type { Category } from "../../types/category";
import type { ArticleGroup } from "../../types/articleGroup";
import "./ArticleForm.css"
import { useQuery } from "@tanstack/react-query";
import { createArticleGroupQueryOptions } from "../query_options/articleGroupQueryOptions";
import { createCategoryQueryOptions } from "../query_options/categoryQueryOptions";
import type { ArticleSubmissionRequest } from "../../types/dto/articleSubmission";
import uploadSymbol from "../../assets/uploadsymbol.png"

function GroupCheckBox({ group, defaultChecked, style, onCheck }: { group: ArticleGroup, defaultChecked: boolean, style: string, onCheck: (id: number) => void }) {

    return <>
        <div className={style}>
            <label>{group.title}</label>
            <input type="checkbox" onChange={() => onCheck(group.id)} defaultChecked={defaultChecked} />


        </div>
    </>

}

function GroupCheckBoxes({ article, groupStyle, checkBoxStyle, onCheckedGroupsChange }: { article: Article | null, groupStyle: string, checkBoxStyle: string, onCheckedGroupsChange: (groups: number[]) => void }) {
    const { data } = useQuery(createArticleGroupQueryOptions())
    var groupItems = data?.flatMap(a => a.items)
    const [containingGroups, setContainingGroups] = useState<number[]>(groupItems!.filter(x => x?.articleId == article?.id).map(y => y!.articleGroupId));

    function handleCheck(id: number) {
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
            {data?.map(g => <GroupCheckBox key={g.id} group={g} style={checkBoxStyle} defaultChecked={containingGroups.includes(g.id)} onCheck={(id) => handleCheck(id)} />)}
        </div>
    }
    catch (Err) {
        console.error(Err)
    }

}

function CategoryCheckBoxes({ article, onCheckedFiltersChanged }: { article: Article | null, onCheckedFiltersChanged: (checkedFilters: Set<number>) => void }) {
    try {
        const [filters, setFilters] = useState<Set<number>>(new Set(article?.categories))
        const { data } = useQuery(createCategoryQueryOptions());
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
            {data?.map(cat => { return <CategoryBox key={cat.id} defaultCheckState={article?.categories.includes(cat.id) ?? false} category={cat} isChecked={(filter) => { handleFilterChange(filter) }} /> })}
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
        { article: Article | null, onSubmit: (articleSubmission: ArticleSubmissionRequest) => Promise<void>, onDiscard: () => void, onPreview: () => void }
) {
    const authContext = useContext(AuthContext);
    const [title, setTitle] = useState(article?.title)
    const [content, setContent] = useState(article?.content)
    const [thumbnailFile, setThumbnailFile] = useState<File | undefined>()
    const [thumbnailPreview, setThumbnailPreview] = useState(article?.thumbnailLink);
    const [checkedCategories, setCheckedCategories] = useState<number[]>(article?.categories ?? [])
    const { data } = useQuery(createArticleGroupQueryOptions())
    const groupItems = data?.flatMap(a => a.items);
    const [checkedGroups, setCheckedGroups] = useState<number[]>(groupItems?.filter(gi => gi!.articleId == article?.id).map(x => x!.articleGroupId) ?? [])
    const authorId = authContext?.user?.id ?? -1
    const [authorName, setAuthorName] = useState<string>(authContext?.user?.name ?? "")
    const fileInputRef = useRef<HTMLInputElement>(null);




    function SaveDiscardButtons({ onSubmit, onDiscard, onPreview }: { onSubmit: () => void, onDiscard: () => void, onPreview: () => void }) {
        return <div className="btns-container">
            <button className="bigbutton noborder pthover semitransparent save" onClick={onSubmit}>Salvar</button>
            <button className="bigbutton noborder pthover semitransparent discard" onClick={onDiscard}>Descartar</button>
            <button className="bigbutton noborder pthover semitransparent preview" onClick={onPreview}>Preview</button>
        </div>
    }

    function handleSave() {
        if (!authorName || authorName.trim().length === 0) {
            alert("Nome do autor é um campo obrigatório")
            return;
        }
        if (title && content) {
            const formData: ArticleSubmissionRequest = {
                title: title,
                articleId: article?.id ?? null,
                description: null,
                thumbnailFile: thumbnailFile ?? null,
                submitterId: authorId,
                submitterName: authorName,
                content: content,
                categories: checkedCategories,
                groups: checkedGroups,
                type: article ? "update" : "create"
            }
            alert("ok");
            onSubmit(formData);
        }
    }

    function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file)
            return;

        const localUrl = URL.createObjectURL(file);

        setThumbnailPreview(localUrl);
        setThumbnailFile(file);
    }


    return (
        <>
            {
                <>
                    {
                        <div className="mainContainer">
                            <p>Titulo:</p>
                            <br />
                            <input type="text" onChange={e => setTitle(e.target.value)} defaultValue={article?.title} id="title" className="title-input gbluebg noborder" />
                            <p className="subt-small">Titulo original:</p>
                            <p className="subt-small">{article?.title}</p>
                            <br />
                            <div className="flex column align-center gap20">
                                <p>Foto Thumbnail:</p>
                                <img id='thumbPreview' className="previewImage" src={thumbnailPreview} />
                                <button className="upload pthover margin-down20" onClick={() => fileInputRef.current?.click()}>
                                    <img className="smallicon whitetint" src={uploadSymbol} />
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg, image/webp"
                                        ref={fileInputRef}
                                        style={{ display: "none" }}
                                        onChange={handleImageUpload}
                                    />
                                </button>
                            </div>

                            <br />
                            <br />
                            <p>Conteudo:</p>
                            <textarea defaultValue={article?.content} onChange={e => setContent(e.target.value)} id="content" className="content-input gbluebg noborder" />
                            <br />
                            <p className="margin-down20">Se encaixa em:</p>
                            <CategoryCheckBoxes article={article ?? null} onCheckedFiltersChanged={(checkedCategories) => setCheckedCategories(Array.from(checkedCategories))} />

                            <div className="groupBoxes">
                                <p className="margin-down20 ">Mostrar em:</p>
                                <GroupCheckBoxes article={article ?? null} groupStyle={"posright50"} checkBoxStyle="grid g5005" onCheckedGroupsChange={(groups) => setCheckedGroups(groups)} />
                            </div>
                            {authContext?.isAuthenticated ? (<></>) : (<div className="margin-top30">
                                Autor: <input type="text" defaultValue={authorName} onChange={(e) => setAuthorName(e.target.value)} />
                            </div>)}



                            <SaveDiscardButtons onSubmit={handleSave} onDiscard={onDiscard} onPreview={onPreview} />
                        </div>
                    }

                </>
            }
        </>
    )
}

export default ArticleForm