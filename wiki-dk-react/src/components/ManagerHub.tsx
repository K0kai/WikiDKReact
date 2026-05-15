import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "./ManagerHub.css";
import "./reusable/Modal.css"
import arrow from "../assets/right_arrow.svg";
import plus from "../assets/plus.png";
import editIcon from "../assets/edit-icon.png";
import trashIcon from "../assets/trash-icon.png";
import type { Category } from "../types/category";
import type { ArticleGroup } from "../types/articleGroup";
import Modal from "./reusable/Modal";
import CategoryForm from "./reusable/CategoryForm";
import GroupForm from "./reusable/GroupForm";
import { type Rank } from "../context/RankContext";
import RankForm from "./reusable/RankForm";
import { useQuery } from "@tanstack/react-query";
import { createCategoryQueryOptions } from "./query_options/categoryQueryOptions";
import { createRanksQueryOptions } from "./query_options/ranksQueryOptions";
import { createArticleGroupQueryOptions } from "./query_options/articleGroupQueryOptions";
import { deleteCategory } from "../api/categoryAPI";

/* ---------------- GLOBALS ---------------- */


/* ---------------- TYPES ---------------- */

type DropdownProps = {
    name: string;
    onOpenModal: () => void;
    onOpenEditModal: (editObject: Category | ArticleGroup | any) => void;
    children: React.ReactNode
};

type ModalState = {
    type: string | null
    mode: string
    payload: any
}


/* ---------------- UI HELPERS ---------------- */

function ViewRank({ rank, onOpenEditModal }: { rank: Rank, onOpenEditModal: (rank: Rank) => void }) {

    return (
        <div
            key={rank.id}
            className="flex side-by-side justify-content-center margin-down20 category-ctr"
        >
            <button className="nobg noborder pthover category-edit">
                <img className="smallicon" onClick={() => onOpenEditModal(rank)} src={editIcon} />
            </button>

            <button className="nobg noborder pthover category-delete">
                <img className="redtint smallicon" onClick={() => null} src={trashIcon} />
            </button>

            <div className="margin-left15">
                <div className="flex side-by-side">
                    <img className="mediumicon margin-right15" src={rank.icon} />
                    <p className="fontinter blackfont">{rank.name}</p>
                </div>
                <p className="fontsmall fontinter blackfont">{rank.description || ""}</p>
            </div>
        </div>
    );
}

function ViewGroup({ group, onOpenEditModal }: { group: ArticleGroup, onOpenEditModal: (group: ArticleGroup) => void }) {

    const handleDelete = async (group: ArticleGroup) => {
        const confirmation = confirm(
            `Tem certeza que deseja apagar '${group.title}'? essa ação é irreversível`
        );
        if (!confirmation) return;
    };

    return (
        <div
            key={group.id}
            className="flex side-by-side justify-content-center margin-down20 category-ctr"
        >
            <button className="nobg noborder pthover category-edit">
                <img className="smallicon" onClick={() => onOpenEditModal(group)} src={editIcon} />
            </button>

            <button className="nobg noborder pthover category-delete">
                <img className="redtint smallicon" onClick={() => handleDelete(group)} src={trashIcon} />
            </button>

            <div className="margin-left15">
                <div className="flex side-by-side">
                    <p className="fontinter blackfont">{group.title}</p>
                </div>
                <p className="fontinter blackfont fontsmall">{group.description || ""}</p>
            </div>
        </div>
    );


}

function ViewCategory({ category, onOpenEditModal }: { category: Category, onOpenEditModal: (category: Category) => void }) {

    const handleDelete = async (category: Category) => {
        const confirmation = confirm(
            `Tem certeza que deseja apagar ${category.name}? essa ação é irreversível`
        );

        if (!confirmation) return;

        await deleteCategory(category.id);
    };

    return (
        <div
            key={category.id}
            className="flex side-by-side justify-content-center margin-down20 category-ctr"
        >
            <button className="nobg noborder pthover category-edit">
                <img className="smallicon" onClick={() => onOpenEditModal(category)} src={editIcon} />
            </button>

            <button className="nobg noborder pthover category-delete">
                <img className="redtint smallicon" onClick={() => handleDelete(category)} src={trashIcon} />
            </button>

            <div className="margin-left15">
                <div className="flex side-by-side">
                    <img className="mediumicon margin-right15" src={category.icon} />
                    <p className="fontinter blackfont">{category.name}</p>
                </div>
                <p className="fontsmall fontinter blackfont">{category.description || ""}</p>
            </div>
        </div>
    );
}




/* ---------------- DROPDOWN ---------------- */

function Dropdown({ name, onOpenModal, children }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="dropdown-root">
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="dropdown-header"
            >
                {name}
                <img
                    src={arrow}
                    className={`arrow ${isOpen ? "open" : ""}`}
                />
            </button>

            <div className={`dropdown-body ${isOpen ? "open" : ""}`}>
                <div className="dropdown-inner">
                    {children}

                    <div className="btncontainer">
                        <img className="smallicon" src={plus} />
                        <button
                            className="realbtn"
                            onClick={onOpenModal}
                        >
                            Adicionar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ---------------- MAIN ---------------- */

export default function ManagerHub() {
    const authContext = useContext(AuthContext);

    const [isPermitted, setIsPermitted] = useState(false);
    const [modalState, setModalState] = useState<ModalState>({ type: null, mode: "", payload: null })

    const categoryQuery = useQuery(createCategoryQueryOptions())
    const rankQuery = useQuery(createRanksQueryOptions())
    const articleGroupQuery = useQuery(createArticleGroupQueryOptions())

    const categories = categoryQuery.data
    const articleGroups = articleGroupQuery.data
    const ranks = rankQuery.data


    useEffect(() => {
        setIsPermitted(authContext?.hasRole(1) ?? false);
    }, [authContext]);

    if (!isPermitted) return <p>Unauthorized</p>;

    return (
        <>
            {modalState.type == "category" ? (<>
                <Modal children={<CategoryForm category={modalState.payload} onClose={() => setModalState({ type: null, mode: "", payload: null })} mode={modalState.mode} />} onClose={() => { setModalState({ type: null, mode: "", payload: null }) }} />
            </>) : (<></>)}
            {modalState.type == "group" ? (<>
                <Modal children={<GroupForm group={modalState.payload} onClose={() => setModalState({ type: null, mode: "", payload: null })} mode={modalState.mode} />} onClose={() => { setModalState({ type: null, mode: "", payload: null }) }} />
            </>) : (<></>)}
            {modalState.type == "rank" ? (<>
                <Modal children={<RankForm rank={modalState.payload} onClose={() => setModalState({ type: null, mode: "", payload: null })} mode={modalState.mode} />} onClose={() => { setModalState({ type: null, mode: "", payload: null }) }} />
            </>) : (<></>)}
            <div className="dropdowns-container">
                {categoryQuery.isLoading ? (<></>) : (<></>)}
                <Dropdown
                    name="Categorias"
                    onOpenModal={() => setModalState({ type: "category", mode: "create", payload: null })}
                    onOpenEditModal={(category) => {
                        setModalState({ type: "category", mode: "update", payload: category });
                    }}
                    children={!categoryQuery.isLoading ? (categories?.map(cat => <ViewCategory key={cat.id} category={cat} onOpenEditModal={(cat) => setModalState({ type: "category", mode: "update", payload: cat })} />)) : (<><img className="mediumicon" src="https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/ring-resize-white-36.svg"/></>)}

                />
                <Dropdown
                    name="Grupos de Artigos"
                    onOpenModal={() => setModalState({ type: "group", mode: "create", payload: null })}
                    onOpenEditModal={(group) => {
                        setModalState({ type: "group", mode: "update", payload: group });
                    }}
                    children={!articleGroupQuery.isLoading ? (articleGroups?.map(artG => <ViewGroup key={artG.id} group={artG} onOpenEditModal={(artG) => setModalState({ type: "group", mode: "update", payload: artG })} />)) : (<><img className="mediumicon" src="https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/ring-resize-white-36.svg"/></>)}
                />
                <Dropdown
                    name="Patentes"
                    onOpenModal={() => setModalState({ type: "rank", mode: "create", payload: null })}
                    onOpenEditModal={(group) => {
                        setModalState({ type: "rank", mode: "update", payload: group });
                    }}
                    children={!rankQuery.isLoading ? (ranks?.map(rank => <ViewRank key={rank.id} rank={rank} onOpenEditModal={(rank) => setModalState({ type: "rank", mode: "update", payload: rank })} />)) : (<><img className="mediumicon" src="https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/ring-resize-white-36.svg"/></>)}
                />
            </div>
        </>
    );
}