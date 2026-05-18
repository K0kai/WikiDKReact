import { queryOptions } from "@tanstack/react-query";
import type { ArticleGroup } from "../../types/articleGroup";

const API_URL = import.meta.env.VITE_API_URL

export function createMultipleArticleGroupQueryOptions(ids : string){
    return queryOptions({
        queryKey:["article_groups", ids],
        queryFn:() => fetchSelectGroups()
    })

    async function fetchSelectGroups():Promise<ArticleGroup[]>{
        var resp = await fetch(`${API_URL}/articles/groups/by-ids?ids=${ids}`)
        return await resp.json();
    }
}

export function createArticleGroupQueryOptions(){
    return queryOptions({
        queryKey:["article_groups"],
        queryFn: () => fetchArticleGroups(),
        staleTime:360000
    })

    async function fetchArticleGroups(): Promise<ArticleGroup[]>{
        var resp = await fetch(`${API_URL}/articles/groups`)
        return await resp.json();
    }
}