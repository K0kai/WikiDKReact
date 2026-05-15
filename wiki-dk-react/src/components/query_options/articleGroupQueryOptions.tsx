import { queryOptions } from "@tanstack/react-query";
import type { ArticleGroup } from "../../types/articleGroup";

const API_URL = import.meta.env.VITE_API_URL

export function createArticleGroupQueryOptions(){
    return queryOptions({
        queryKey:["article_groups"],
        queryFn: () => fetchArticleGroups(),
        staleTime:120000
    })

    async function fetchArticleGroups(): Promise<ArticleGroup[]>{
        var resp = await fetch(`${API_URL}/articles/groups`)
        return await resp.json();
    }
}