import { queryOptions, useMutation } from "@tanstack/react-query";
import type { ArticleSubmission } from "../../types/articleSubmission";
import { rejectSubmission, submitArticle } from "../../api/articleAPI";
import type { ArticleSubmissionRequest } from "../../types/dto/articleSubmission";

const API_URL = import.meta.env.VITE_API_URL;

export function createArticleSubmissionsQueryOptions(page: number, pageSize: number) {

    return queryOptions({
        queryKey: ["article_submissions", page, pageSize],
        queryFn: () => fetchArticleSubmission(),
        staleTime: 60000

    })

    async function fetchArticleSubmission(): Promise<ArticleSubmission[]> {
        var resp = await fetch(`${API_URL}/articles/submissions?page=${page}&pageSize=${pageSize}`)
        return await resp.json();
    }
}

export function createArticleSubmissionCountQueryOptions() {
    return queryOptions({
        queryKey: ["article_submissions", "count"],
        queryFn: () => fetchArticlesSubCount(),
        staleTime: 60000
    })

    async function fetchArticlesSubCount(): Promise<number> {
        var resp = await fetch(`${API_URL}/articles/submissions/count`)
        return await resp.json();
    }
}

export const useRejectSubmission = () => useMutation({
    mutationFn: (id: number) => rejectSubmission(id),
    meta: {
        invalidateQueries: ["article_submissions"],
        successMessage: "Submissão rejeitada",
        errorMessage: "Falha ao rejeitar submissão"
    }
})

export const useSendSubmission = () => useMutation({
    mutationFn: (submissionRequest: ArticleSubmissionRequest) => submitArticle(submissionRequest),
    meta: {
        invalidateQueries: ["article_submissions"],
        successMessage: "Submissão encaminhada para avaliação",
        errorMessage: "Falha ao encaminhar submissão"
    }
})
