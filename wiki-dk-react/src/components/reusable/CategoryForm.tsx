import { useState } from "react";
import { createCategory, updateCategory } from "../../api/categoryAPI";
import type { Category } from "../../types/category";
import { useQueryClient } from "@tanstack/react-query";
import { createCategoryQueryOptions } from "../query_options/categoryQueryOptions";


function CategoryForm({ category, mode, onClose }: {category: Category, mode: string, onClose:() => void}) {

    const [name, setName] = useState<string>(category?.name || "");
    const [description, setDescription] = useState<string>(category?.description || "");
    const [icon, setIcon] = useState<string>(category?.icon || "");
    const queryClient = useQueryClient();
    var categoryQuery = createCategoryQueryOptions();

    const handleSubmit = async () => {

        switch (mode) {
            case "update":
                await updateCategory(
                    category.id,
                    name,
                    description,
                    category.slug,
                    icon
                );
                queryClient.invalidateQueries({queryKey: categoryQuery.queryKey})
                break;

            case "create":
                await createCategory(name, description, icon);
                queryClient.invalidateQueries({queryKey: categoryQuery.queryKey})
                break;
        }

        onClose();
    };

    return (
        <div>
            <h2>Categoria</h2>

            <div className="flex flex-direction-column align-center gap20">
                <input
                    className="nooutline"
                    placeholder="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    className="nooutline"
                    placeholder="Descrição"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <input
                    className="nooutline"
                    placeholder="Link"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                />

                <p>Preview do ícone:</p>
                {icon && <img className="mediumicon test" src={icon} alt="preview" />}
            </div>

            <div className="flex flex-direction-column gap40 margin-top30">
                <button onClick={handleSubmit}>
                    Salvar
                </button>

                <button onClick={onClose}>
                    Fechar
                </button>
            </div>
        </div>
    );
}

export default CategoryForm;