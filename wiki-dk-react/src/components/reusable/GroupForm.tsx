import { useState } from "react";
import type { ArticleGroup } from "../../types/articleGroup";
import { createGroup, updateGroup } from "../../api/articleGroupAPI";
import { useQueryClient } from "@tanstack/react-query";
import { createArticleGroupQueryOptions } from "../query_options/articleGroupQueryOptions";


function GroupForm({group, mode, onClose}:{group : ArticleGroup, mode: string, onClose:() => void}){
    const [title, setTitle] = useState<string>(group?.title)
    const [description, setDescription] = useState<string>(group?.description)
    const [displayHome, setDisplayHome] = useState<boolean>(group?.displayOnHome ?? false);
    const [displaySidebar, setDisplaySidebar] = useState<boolean>(group?.displayOnSidebar ?? false)
    const queryClient = useQueryClient();
    const groupQuery = createArticleGroupQueryOptions();
    

     const handleUpdate = async () => {
        switch (mode) {
            case "update":
                await updateGroup(group.id, title, description, displayHome, displaySidebar)
                queryClient.invalidateQueries({queryKey:groupQuery.queryKey})
                onClose();
                break;
            case "create":
                await createGroup(title, description, displayHome, displaySidebar)
                queryClient.invalidateQueries({queryKey:groupQuery.queryKey})
                onClose();
                break;
        }

    }

    return <div>
        <h2>Grupo</h2>
        <div className="flex column align-center gap20">
            <input type="text" defaultValue={title} onChange={(e) => { setTitle(e.target.value) }} placeholder="Titulo" />
            <input type="text" defaultValue={description} onChange={(e) => { setDescription(e.target.value) }} placeholder="Descrição" />
            <div>
                <input type="checkbox" defaultChecked={displayHome} onChange={(e) => { setDisplayHome(e.target.checked) }} />
                <label className="fontsmall">Mostrar na pagina principal</label>
            </div>
            <div>
                <input type="checkbox" defaultChecked={displaySidebar} onChange={(e) => { setDisplaySidebar(e.target.checked) }} />
                <label className="fontsmall">Mostrar na barra lateral</label>
            </div>


        </div>
        <div className="flex flex-direction-column gap40 margin-top30">
                <button onClick={() => handleUpdate()}>
                    Salvar
                </button>
                <button onClick={onClose}>Fechar</button>
            </div>

    </div>    
}

export default GroupForm;