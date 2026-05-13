import { useContext, useState } from "react";
import type { Category } from "../../types/category";
import { CategoryContext } from "../../context/CategoryContext";

function CategoryForm({ category, mode, onClose }: { category: Category, mode: string, onClose: () => void }) {
    let name = category?.name;
    let description = category?.description;
    const [icon, setIcon] = useState<string>(category?.icon);
    const catContext = useContext(CategoryContext);

    const handleUpdate = () => {
        switch (mode) {
            case "update":
                catContext?.updateCategory(category.id, name, description, category.slug, icon)
                onClose();
                break;
            case "create":
                catContext?.createCategory(name, description, icon)
                onClose();
                break;
        }

    }

    return (
        <div className="">
            <h2>{`Categoria`} </h2>
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
                    Salvar
                </button>
                <button onClick={onClose}>Fechar</button>
            </div>
        </div>
    );
}

export default CategoryForm;