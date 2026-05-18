import { useState } from "react";
import { type Rank } from "../../types/rank";
import { createRank } from "../../api/rankAPI";
import { useQueryClient } from "@tanstack/react-query";
import { createRanksQueryOptions } from "../query_options/ranksQueryOptions";


function RankForm({ rank, mode, onClose }: {rank: Rank, mode: string, onClose:() => void}) {

    const [name, setName] = useState<string>(rank?.name || "");
    const [description, setDescription] = useState<string>(rank?.description || "");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>(rank?.icon || "");
    const queryClient = useQueryClient();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImage(file);

        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {

        switch (mode) {
            case "update":
                if (!rank) return;

                break;

            case "create":
                await createRank({ name: name, description: description, image: image });
                queryClient.invalidateQueries({queryKey: createRanksQueryOptions().queryKey})
                break;
        }

        onClose();
    };




    return (
        <div>
            <h2>Rank</h2>

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
                    type="file"
                    accept="image/*"
                    className="nooutline"
                    onChange={handleFileChange}
                />

                <p>Preview do ícone:</p>
                {preview && <img className="mediumicon" src={preview} alt="preview" />}
                
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

export default RankForm;