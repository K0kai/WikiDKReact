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
import Modal from "../reusable/Modal";
import MessageBox from "../reusable/MessageBox";

function GroupCheckBox({ group, defaultChecked, onCheck }: { group: ArticleGroup, defaultChecked: boolean, onCheck: (id: number) => void }) {
    const checkboxId = `${group.id}_${group.title}`
    return (
        <div className="article-form-checkbox" onClick={() => onCheck(group.id)}>
            <label htmlFor={checkboxId} style={{userSelect:"none"}}>{group.title}</label>
            <input id={checkboxId} type="checkbox" onChange={() => onCheck(group.id)} defaultChecked={defaultChecked} />
        </div>
    );
}

function GroupCheckBoxes({ article, onCheckedGroupsChange }: { article: Article | null, onCheckedGroupsChange: (groups: number[]) => void }) {
    const { data } = useQuery(createArticleGroupQueryOptions());
    const groupItems = data?.flatMap(a => a.items);
    const [containingGroups, setContainingGroups] = useState<number[]>(
        groupItems?.filter(x => x?.articleId === article?.id).map(y => y!.articleGroupId) ?? []
    );

    function handleCheck(id: number) {
        setContainingGroups(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            const arr = Array.from(next);
            onCheckedGroupsChange(arr);
            return arr;
        });
    }

    return (
        <div className="checks-grid">
            {data?.map(g => (
                <GroupCheckBox
                    key={g.id}
                    group={g}
                    defaultChecked={containingGroups.includes(g.id)}
                    onCheck={handleCheck}
                />
            ))}
        </div>
    );
}

function CategoryCheckBoxes({ article, onCheckedFiltersChanged }: { article: Article | null, onCheckedFiltersChanged: (checkedFilters: Set<number>) => void }) {
    const [_filters, setFilters] = useState<Set<number>>(new Set(article?.categories));
    const { data } = useQuery(createCategoryQueryOptions());

    function handleFilterChange(filter: CategoryFilter) {
        setFilters(prev => {
            const next = new Set(prev);
            filter.value ? next.add(filter.id) : next.delete(filter.id);
            onCheckedFiltersChanged(next);
            return next;
        });
    }

    return (
        <div className="checks-grid">
            {data?.map(cat => (
                <CategoryBox
                    key={cat.id}
                    category={cat}
                    defaultCheckState={article?.categories.includes(cat.id) ?? false}
                    isChecked={handleFilterChange}
                />
            ))}
        </div>
    );
}

function CategoryBox({ category, defaultCheckState, isChecked }: { category: Category, defaultCheckState: boolean, isChecked: (filter: CategoryFilter) => void }) {
    const id = `${category.name}_${category.id}`;
    return (
        <div className="article-form-checkbox">
            <label style={{userSelect:"none"}} htmlFor={id}>
                <img className="smallicon" src={category.icon} alt="" />
                {category.name}
            </label>
            <input
                id={id}
                type="checkbox"
                defaultChecked={defaultCheckState}
                onChange={e => isChecked({ id: category.id, value: e.target.checked })}
            />
        </div>
    );
}

export type ArticleFormData = {
    title: string;
    content: string;
    thumbnailLink: string;
    categories: number[];
    groups: number[];
}

function ArticleForm({ article, onSubmit, onDiscard, onPreview }: {
    article: Article | null;
    onSubmit: (articleSubmission: ArticleSubmissionRequest) => Promise<boolean>;
    onDiscard?: () => void;
    onPreview?: () => void;
}) {
    const authContext = useContext(AuthContext);
    const [title, setTitle] = useState(article?.title ?? "");
    const [content, setContent] = useState(article?.content ?? "");
    const [thumbnailFile, setThumbnailFile] = useState<File | undefined>();
    const [thumbnailPreview, setThumbnailPreview] = useState(article?.thumbnailLink);
    const [checkedCategories, setCheckedCategories] = useState<number[]>(article?.categories ?? []);
    const { data } = useQuery(createArticleGroupQueryOptions());
    const groupItems = data?.flatMap(a => a.items);
    const [checkedGroups, setCheckedGroups] = useState<number[]>(
        groupItems?.filter(gi => gi!.articleId === article?.id).map(x => x!.articleGroupId) ?? []
    );
    const [authorName, setAuthorName] = useState(authContext?.user?.name ?? "");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [modal, setModal] = useState<string>();
    const [emptyFields, setEmptyFields] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState<boolean>(false)

    async function handleSave() {
        const empty: string[] = [];
        if (!authorName.trim()) empty.push("'Nome do autor'");
        if (!title.trim()) empty.push("'Título'");
        if (!content.trim()) empty.push("'Conteúdo'");

        setEmptyFields(empty);
        if (empty.length > 0) { setModal("failed-submit"); return; }

        var resp = await onSubmit({
            title,
            articleId: article?.id ?? null,
            description: null,
            thumbnailFile: thumbnailFile ?? null,
            submitterId: authContext?.user?.id ?? -1,
            submitterName: authorName,
            content,
            categories: checkedCategories,
            groups: checkedGroups,
            type: article ? "update" : "create"
        });
        setIsSaving(resp)
    }

    function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setThumbnailPreview(URL.createObjectURL(file));
        setThumbnailFile(file);
    }

    return (
        <>
            {modal === "failed-submit" && (
                <Modal onClose={() => setModal("")}>
                    <MessageBox
                        title="Erro"
                        message={`Os campos: ${emptyFields.join(', ')} não podem estar vazios`}
                        onClose={() => setModal("")}
                        onConfirm={() => setModal("")}
                        type="error"
                    />
                </Modal>
            )}

            <div className="mainContainer">

                <div className="form-section">
                    <label className="field-label" htmlFor="title">Título</label>
                    <input
                        id="title"
                        className="title-input"
                        type="text"
                        defaultValue={article?.title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Nome do artigo..."
                    />
                    {article?.title && (
                        <p className="field-hint">Título original: {article.title}</p>
                    )}
                </div>

                <div className="form-section">
                    <label className="field-label">Thumbnail</label>
                    <div className="thumb-zone">
                        {thumbnailPreview
                            ? <img className="previewImage" src={thumbnailPreview} alt="preview" />
                            : <div className="previewImage thumb-placeholder">sem imagem</div>
                        }
                        <div className="thumb-right">
                            <p className="field-hint">Formatos aceitos: PNG, JPG, WEBP.</p>
                            <button className="upload" onClick={() => fileInputRef.current?.click()}>
                                ↑ Carregar imagem
                            </button>
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/webp"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleImageUpload}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <label className="field-label" htmlFor="content">Conteúdo</label>
                    <textarea
                        id="content"
                        className="content-input"
                        defaultValue={article?.content}
                        onChange={e => setContent(e.target.value)}
                        placeholder="Escreva o conteúdo do artigo..."
                    />
                </div>

                <div className="form-section">
                    <label className="field-label">Categorias</label>
                    <CategoryCheckBoxes
                        article={article}
                        onCheckedFiltersChanged={f => setCheckedCategories(Array.from(f))}
                    />
                </div>

                <div className="form-section">
                    <label className="field-label">Mostrar em</label>
                    <GroupCheckBoxes
                        article={article}
                        onCheckedGroupsChange={setCheckedGroups}
                    />
                </div>

                {!authContext?.isAuthenticated && (
                    <div className="form-section">
                        <label className="field-label" htmlFor="author">Autor</label>
                        <input
                            id="author"
                            className="title-input"
                            type="text"
                            defaultValue={authorName}
                            onChange={e => setAuthorName(e.target.value)}
                            placeholder="Seu nome..."
                        />
                    </div>
                )}

                <div className="btns-container">
                    <button className="bigbutton save" onClick={handleSave}>{isSaving ? (<img className="smallicon" src="https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/ring-resize-white-36.svg"/>) : (<>Salvar</>)}</button>
                    <button className="bigbutton preview" onClick={onPreview}>Preview</button>
                    <button className="bigbutton discard" onClick={onDiscard}>Descartar</button>
                </div>

            </div>
        </>
    );
}

export default ArticleForm;