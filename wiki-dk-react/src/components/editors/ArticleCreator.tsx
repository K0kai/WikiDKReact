import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import ArticleForm from "./ArticleForm";
import { useNavigate } from "react-router-dom";
import type { ArticleSubmissionRequest } from "../../types/dto/articleSubmission";
import { useSendSubmission } from "../query_options/articleSubmissionsQueryOptions";


function ArticleCreator(){
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const submit = useSendSubmission()
    if (!authContext)
        throw new Error("Auth context can't be null");    

    async function handleSave(articleSubmissionRequest : ArticleSubmissionRequest){
        submit.mutate(articleSubmissionRequest)
        navigate(-1);
        return submit.isError || submit.isSuccess
    }

    function handleDiscard(){
        navigate(-1);
    }

    function handlePreview(){

    }

    return <>    
    <ArticleForm article={null} onSubmit={handleSave} onDiscard={handleDiscard} onPreview={handlePreview} ></ArticleForm>
    </>

}

export default ArticleCreator;