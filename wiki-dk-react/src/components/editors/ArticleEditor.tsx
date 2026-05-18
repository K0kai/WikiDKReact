import { useNavigate, useParams } from "react-router-dom";
import ArticleForm from "./ArticleForm";
import { useQuery } from "@tanstack/react-query";
import { createSingleArticleQueryOptions } from "../query_options/articleQueryOptions";
import type { ArticleSubmissionRequest } from "../../types/dto/articleSubmission";
import { useSendSubmission } from "../query_options/articleSubmissionsQueryOptions";




function ArticleEditor() {
    const { id } = useParams<{ id: string }>();
    const { data } = useQuery(createSingleArticleQueryOptions(Number(id)));
    const navigate = useNavigate()
    const submit = useSendSubmission()

    async function handleSubmit(articleSubmissionRequest: ArticleSubmissionRequest) {
        submit.mutate(articleSubmissionRequest);
        return submit.isError || submit.isSuccess
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