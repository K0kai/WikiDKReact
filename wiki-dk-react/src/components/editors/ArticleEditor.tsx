import { useNavigate, useParams } from "react-router-dom";
import "./ArticleEditor.css"
import ArticleForm from "./ArticleForm";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createSingleArticleQueryOptions } from "../query_options/articleQueryOptions";
import type { ArticleSubmissionRequest } from "../../types/dto/articleSubmission";
import { submitArticle } from "../../api/articleAPI";




function ArticleEditor() {
    const { id } = useParams<{ id: string }>();
    const { data } = useQuery(createSingleArticleQueryOptions(Number(id)));
    const navigate = useNavigate()
    const queryClient = useQueryClient();

    async function handleSubmit(articleFormData: ArticleSubmissionRequest) {
        await submitArticle(articleFormData)
        queryClient.invalidateQueries({ queryKey: [createSingleArticleQueryOptions(Number(id)).queryKey] })
        alert(`Submissão encaminhada com sucesso, aguarde a avaliação de um administrador.`)
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