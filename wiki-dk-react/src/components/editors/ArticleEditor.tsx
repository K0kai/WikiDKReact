import { useNavigate, useParams } from "react-router-dom";
import "./ArticleEditor.css"
import ArticleForm, { type ArticleFormData } from "./ArticleForm";
import { useQuery } from "@tanstack/react-query";
import { createSingleArticleQueryOptions } from "../query_options/articleQueryOptions";

const API_URL = import.meta.env.VITE_API_URL;




function ArticleEditor() {
    const { id } = useParams<{ id: string }>();
    const {data} = useQuery(createSingleArticleQueryOptions(Number(id)));
    const navigate = useNavigate()

    async function handleSubmit(articleFormData: ArticleFormData) {
        console.log(articleFormData);
        var resp = await fetch(`${API_URL}/articles/update/${id}`, {
            method:"PUT",
            headers:{
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type":"application/json"
            },
            body: JSON.stringify(articleFormData)
        })
        if (resp.ok){
            alert("Changes saved!")
            navigate(-1);
        }
        else
            console.error(resp.status)
    }
    async function handleDiscard() {
        navigate(-1);
    }
    async function handlePreview() {

    }
    return <>
        {data ? (<ArticleForm article={data} onSubmit={handleSubmit} onDiscard={handleDiscard} onPreview={handlePreview} ></ArticleForm>) : (<><img src="https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/ring-resize-white-36.svg" /></>)}

    </>
}


export default ArticleEditor;