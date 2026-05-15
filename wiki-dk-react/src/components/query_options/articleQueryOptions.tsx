import { queryOptions } from "@tanstack/react-query";
import type { ArticleFilter } from "../../context/ArticleContext";
import type { Article } from "../../types/article";

const API_URL = import.meta.env.VITE_API_URL

export function createSingleArticleQueryOptions(id : number){
    return queryOptions({
        queryKey:["article", id],
        queryFn: () => fetchSingleArticle(),
        staleTime:60000
    })

    async function fetchSingleArticle() : Promise<Article>{
        var resp = await fetch(`${API_URL}/articles/get/${id}`)
        return await resp.json();
    }
}


export function createGroupedArticleQueryOptions(){
    return queryOptions({
        queryKey:["articles", "grouped"],
        queryFn: () => fetchGroupedArticles(),
        staleTime: 300000
    })

    async function fetchGroupedArticles(): Promise<Article[]>{
        try{
        var resp = await fetch(`${API_URL}/articles/grouped`)
        return await resp.json();
        }
        catch (Err){
            return [];
        }
    }
}

export function createPaginatedArticleQueryOptions(filter: ArticleFilter){
    return queryOptions({
        queryKey:["articles", "paginated", filter],
        queryFn: () => fetchPaginatedArticles(),
        staleTime: 60000
    })

    async function fetchPaginatedArticles(): Promise<Article[]>{
        try {
            var resp = await fetch(`${API_URL}/articles/get`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(filter)
            })
            var data : Article[] = await resp.json();
            return data;
        }
        catch (err) {
            return [];
        }
    }
}