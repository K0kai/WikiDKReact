import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import { CategoryContext } from "../context/CategoryContext";
import "./ManagerHub.css";
import "./reusable/Modal.css"

import arrow from "../assets/right_arrow.svg";
import plus from "../assets/plus.png";
import editIcon from "../assets/edit-icon.png";
import trashIcon from "../assets/trash-icon.png";

import type { Category } from "../types/category";
import type { ArticleGroup } from "../types/articleGroup";
import { ArticleContext } from "../context/ArticleContext";
import Modal from "./reusable/Modal";
import CategoryForm from "./reusable/CategoryForm";
import GroupForm from "./reusable/GroupForm";
import { ArticleGroupContext } from "../context/ArticleGroupContext";

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

function ViewGroup({ group, onOpenEditModal }: { group: ArticleGroup, onOpenEditModal: (group: ArticleGroup) => void }) {
    const articleContext = useContext(ArticleContext);
    if (!articleContext) throw new Error("Article context can't be null");

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

    const catContext = useContext(CategoryContext);
    if (!catContext) throw new Error("Category Context cant be null");

    const handleDelete = async (category: Category) => {
        const confirmation = confirm(
            `Tem certeza que deseja apagar ${category.name}? essa ação é irreversível`
        );

        if (!confirmation) return;

        await catContext.deleteCategory(category.id);
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



/* ---------------- MODAL ---------------- */

function OpenEditCategoryModal({
    isOpen,
    onClose,
    category
}: {
    isOpen: boolean,
    onClose: () => void;
    category: Category
}) {
    if (!isOpen) return null;

    let name = category.name;
    let description = category.description;
    const [icon, setIcon] = useState<string>(category.icon);
    const catContext = useContext(CategoryContext);

    const handleUpdate = () => {
        catContext?.updateCategory(category.id, name, description, category.slug, icon)
        onClose();
    }

    return (
        <div className="overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>{`Editar ${category.name}`} </h2>

                <div className="flex flex-direction-column align-center gap20">
                    <input
                        className="nooutline"
                        placeholder="Nome"
                        defaultValue={name}
                        onChange={(e) => (name = e.target.value)}
                    />
                    <input
                        className="nooutline"
                        placeholder="Descrição"
                        defaultValue={description}
                        onChange={(e) => (description = e.target.value)}
                    />
                    <input
                        className="nooutline"
                        placeholder="Link"
                        defaultValue={icon}
                        onChange={(e) => (setIcon(e.target.value))}
                    />
                    <p>Preview do icone:</p>
                    <img className="mediumicon test" src={icon} />
                </div>

                <div className="flex flex-direction-column gap40 margin-top30">
                    <button onClick={() => handleUpdate()}>
                        Atualizar
                    </button>
                    <button onClick={onClose}>Fechar</button>
                </div>
            </div>
        </div>
    );


}

function OpenCategoryModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const catContext = useContext(CategoryContext);
    if (!catContext)
        throw new Error("Category context cant be null");


    if (!isOpen) return null;

    let name = "";
    let description = "";

    const handleCreate = () => {
        catContext.createCategory(name, description, null);
        onClose();
    }

    return (
        <div className="overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>Nova Categoria</h2>

                <div className="flex flex-direction-column gap20">
                    <input
                        className="nooutline"
                        placeholder="Nome"
                        onChange={(e) => (name = e.target.value)}
                    />
                    <input
                        className="nooutline"
                        placeholder="Descrição"
                        onChange={(e) => (description = e.target.value)}
                    />
                </div>

                <div className="flex flex-direction-column gap40 margin-top30">
                    <button onClick={() => handleCreate()}>
                        Criar
                    </button>
                    <button onClick={onClose}>Fechar</button>
                </div>
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
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)

    const catContext = useContext(CategoryContext);
    const articleGroupContext = useContext(ArticleGroupContext);
    if (!catContext)
        throw new Error("Category Context cant be null");
    if (!articleGroupContext)
        throw new Error("Article context can't be null");

    const categories = catContext.categories
    const articleGroups = articleGroupContext.groups


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
            <div className="dropdowns-container">

                <Dropdown
                    name="Categorias"
                    onOpenModal={() => setModalState({ type: "category", mode: "create", payload: null })}
                    onOpenEditModal={(category) => {
                        setModalState({ type: "category", mode: "update", payload: category });
                    }}
                    children={categories.map(cat => <ViewCategory key={cat.id} category={cat} onOpenEditModal={(cat) => setModalState({ type: "category", mode: "update", payload: cat })} />)}

                />
                <Dropdown
                    name="Grupos de Artigos"
                    onOpenModal={() => setModalState({ type: "group", mode: "create", payload: null })}
                    onOpenEditModal={(group) => {
                        setModalState({ type: "group", mode: "update", payload: group });
                    }}
                    children={articleGroups.map(artG => <ViewGroup key={artG.id} group={artG} onOpenEditModal={(artG) => setModalState({ type: "group", mode: "update", payload: artG })} />)}
                />
            </div>
        </>
    );
}