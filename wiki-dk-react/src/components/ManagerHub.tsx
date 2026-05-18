import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "./ManagerHub.css";
import type { Category } from "../types/category";
import type { ArticleGroup } from "../types/articleGroup";
import type { Rank } from "../types/rank";
import Modal from "./reusable/Modal";
import CategoryForm from "./reusable/CategoryForm";
import GroupForm from "./reusable/GroupForm";
import RankForm from "./reusable/RankForm";
import { useQuery } from "@tanstack/react-query";
import { createCategoryQueryOptions } from "./query_options/categoryQueryOptions";
import { createRanksQueryOptions } from "./query_options/ranksQueryOptions";
import { createArticleGroupQueryOptions } from "./query_options/articleGroupQueryOptions";
import { deleteCategory } from "../api/categoryAPI";

type ModalState = { type: string | null; mode: string; payload: any };

const Spinner = () => <img className="mediumicon" src="https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/ring-resize-white-36.svg" />;

function Badge({ label, color }: { label: string; color: "green" | "blue" | "red" }) {
    return <span className={`hub-badge hub-badge--${color}`}>{label}</span>;
}

function CategoryRow({ category, onEdit }: { category: Category; onEdit: () => void }) {
    const handleDelete = async () => {
        if (confirm(`Apagar '${category.name}'? Essa ação é irreversível.`))
            await deleteCategory(category.id);
    };
    return (
        <div className="hub-row">
            <div className="hub-row-info">
                <div className="hub-row-name">
                    {category.icon && <img src={category.icon} className="hub-cat-icon" alt="" />}
                    {category.name}
                </div>
                {category.description && <div className="hub-row-desc">{category.description}</div>}
            </div>
            <div className="hub-row-actions">
                <button className="hub-act" onClick={onEdit} aria-label="Editar">✎</button>
                <button className="hub-act hub-act--danger" onClick={handleDelete} aria-label="Apagar">✕</button>
            </div>
        </div>
    );
}

function GroupRow({ group, onEdit }: { group: ArticleGroup; onEdit: () => void }) {
    const handleDelete = async () => {
        if (confirm(`Apagar '${group.title}'? Essa ação é irreversível.`)) { /* call delete API */ }
    };
    return (
        <div className="hub-row">
            <div className="hub-row-info">
                <div className="hub-row-name">
                    {group.title}
                    {group.displayOnHome && <Badge label="home" color="green" />}
                    {group.displayOnSidebar && <Badge label="sidebar" color="blue" />}
                    {group.locked && <Badge label="bloqueado" color="red" />}
                </div>
                {group.description && <div className="hub-row-desc">{group.description}</div>}
            </div>
            <div className="hub-row-actions">
                <button className="hub-act" onClick={onEdit} aria-label="Editar">✎</button>
                <button className="hub-act hub-act--danger" onClick={handleDelete} aria-label="Apagar">✕</button>
            </div>
        </div>
    );
}

function RankRow({ rank, onEdit }: { rank: Rank; onEdit: () => void }) {
    return (
        <div className="hub-row">
            <div className="hub-row-info">
                <div className="hub-row-name">
                    {rank.icon && <img src={rank.icon} className="hub-cat-icon" alt="" />}
                    {rank.name}
                </div>
                {rank.description && <div className="hub-row-desc">{rank.description}</div>}
            </div>
            <div className="hub-row-actions">
                <button className="hub-act" onClick={onEdit} aria-label="Editar">✎</button>
                <button className="hub-act hub-act--danger" onClick={() => null} aria-label="Apagar">✕</button>
            </div>
        </div>
    );
}

function Panel({ title, count, isLoading, onAdd, children }: {
    title: string; count: number; isLoading: boolean; onAdd: () => void; children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`hub-panel ${open ? "open" : ""}`}>
            <div className="hub-panel-header" onClick={() => setOpen(o => !o)}>
                <span className="hub-panel-title">{title}</span>
                <div className="hub-panel-meta">
                    <span className="hub-panel-count">{count} itens</span>
                    <span className="hub-chevron">▼</span>
                </div>
            </div>
            {open && (
                <div className="hub-panel-body">
                    {isLoading ? <div className="hub-loading"><Spinner /></div> : children}
                    <div className="hub-panel-footer" onClick={onAdd}>
                        <span className="hub-add-icon">+</span>
                        <span>Adicionar</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ManagerHub() {
    const authContext = useContext(AuthContext);
    const [isPermitted, setIsPermitted] = useState(false);
    const [modalState, setModalState] = useState<ModalState>({ type: null, mode: "", payload: null });

    const categoryQuery = useQuery(createCategoryQueryOptions());
    const rankQuery = useQuery(createRanksQueryOptions());
    const articleGroupQuery = useQuery(createArticleGroupQueryOptions());

    useEffect(() => { setIsPermitted(authContext?.hasRole(2) ?? false); }, [authContext]);

    if (!isPermitted) return <p>Unauthorized</p>;

    const close = () => setModalState({ type: null, mode: "", payload: null });
    const modal = (type: string, mode: string, payload: any) => setModalState({ type, mode, payload });

    return (
        <>
            {modalState.type === "category" && <Modal onClose={close}><CategoryForm category={modalState.payload} onClose={close} mode={modalState.mode} /></Modal>}
            {modalState.type === "group" && <Modal onClose={close}><GroupForm group={modalState.payload} onClose={close} mode={modalState.mode} /></Modal>}
            {modalState.type === "rank" && <Modal onClose={close}><RankForm rank={modalState.payload} onClose={close} mode={modalState.mode} /></Modal>}

            <div className="hub-wrap">
                <div className="hub-heading">Painel de Gerenciamento</div>

                <Panel title="Categorias" count={categoryQuery.data?.length ?? 0} isLoading={categoryQuery.isLoading} onAdd={() => modal("category", "create", null)}>
                    {categoryQuery.data?.map(cat => (
                        <CategoryRow key={cat.id} category={cat} onEdit={() => modal("category", "update", cat)} />
                    ))}
                </Panel>

                <Panel title="Grupos de Artigos" count={articleGroupQuery.data?.length ?? 0} isLoading={articleGroupQuery.isLoading} onAdd={() => modal("group", "create", null)}>
                    {articleGroupQuery.data?.map(g => (
                        <GroupRow key={g.id} group={g} onEdit={() => modal("group", "update", g)} />
                    ))}
                </Panel>

                <Panel title="Patentes" count={rankQuery.data?.length ?? 0} isLoading={rankQuery.isLoading} onAdd={() => modal("rank", "create", null)}>
                    {rankQuery.data?.map(rank => (
                        <RankRow key={rank.id} rank={rank} onEdit={() => modal("rank", "update", rank)} />
                    ))}
                </Panel>
            </div>
        </>
    );
}