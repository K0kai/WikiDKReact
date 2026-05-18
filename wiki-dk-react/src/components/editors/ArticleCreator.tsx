import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import ArticleForm from "./ArticleForm";
import { useNavigate } from "react-router-dom";
import type { ArticleSubmissionRequest } from "../../types/dto/articleSubmission";
import { submitArticle } from "../../api/articleAPI";


function ArticleCreator(){
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    if (!authContext)
        throw new Error("Auth context can't be null");    

    async function handleSave(formData : ArticleSubmissionRequest){
        var resp = await submitArticle(formData);
        console.log(resp);
        alert("Submissão encaminhada com sucesso, aguarde a aprovação de um administrador.")
        navigate(-1);
    }

    function handleDiscard(){


    }

    function handlePreview(){

    }

    return <>    
    <ArticleForm article={null} onSubmit={handleSave} onDiscard={handleDiscard} onPreview={handlePreview} ></ArticleForm>
    </>

}

export default ArticleCreator;