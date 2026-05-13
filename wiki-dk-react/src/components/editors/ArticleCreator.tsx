import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import ArticleForm, { type ArticleFormData } from "./ArticleForm";
import { ArticleContext } from "../../context/ArticleContext";
import { useNavigate } from "react-router-dom";


function ArticleCreator(){
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const articleContext = useContext(ArticleContext)
    if (!authContext)
        throw new Error("Auth context can't be null");    
    if (!articleContext)
        throw new Error("Article context can't be null");

    const [hasPermission, setHasPermission] = useState<boolean>(false);

    useState(()=>{
        setHasPermission(authContext?.hasRole(1))
    })

    async function handleSave(formData : ArticleFormData){
        articleContext?.createArticle(formData);
        console.log(formData);
        alert("Article created!")
        navigate(-1);
    }

    function handleDiscard(){


    }

    function handlePreview(){

    }

    return <>
    {hasPermission ? (<>
    <ArticleForm article={null} onSubmit={handleSave} onDiscard={handleDiscard} onPreview={handlePreview} ></ArticleForm>
    </>) 
    :(<p>Unauthorized</p>)}
    </>

}

export default ArticleCreator;