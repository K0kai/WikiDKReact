import { createContext, useContext } from "react";
import type { Article } from "../types/article"
import { useEffect, useState, type ReactNode } from "react";
import type { ArticleFormData } from "../components/editors/ArticleForm";
import { ArticleGroupContext } from "./ArticleGroupContext";

const API_URL = import.meta.env.VITE_API_URL


export type ArticleFilter = {
    page: number;
    pageSize: number;
    dateSortType: DateSortType;
    categoryFilters: number[]
}

export type CategoryFilter = {
    id: number,
    value: boolean,
}

export const DateSortType = {
    None: 0,
    UpdatedNewest: 1,
    UpdatedOldest: 2,
    CreatedOldest: 3,
    CreatedNewest: 4
}

export type DateSortType = (typeof DateSortType)[keyof typeof DateSortType];

type ArticleContextType = {
    articles: Record<number,Article>;
    searchedArticles: Article[];
    currentFilter: ArticleFilter;
    isLoading: boolean;
    refresh: () => Promise<void>;
    setFilter: (filter: ArticleFilter) => void;
    createArticle: (formData: ArticleFormData) => Promise<void>;
    deleteArticle:(id: number) => Promise<boolean>;   
    //updateArticle(title: string, content: string, thumbnailLink: string): () => Promise<void>;
    //deleteArticle(id: number): () => Promise<void>;

}

export const ArticleContext = createContext<ArticleContextType | null>(null)

export function ArticleProvider({ children }: { children: ReactNode }) {
    const articleGroupContext = useContext(ArticleGroupContext)
    const [articles, setArticles] = useState<Record<number,Article>>({});
    const pendingArticles : Record<number, Promise<Article>> = {};
    const [searchedArticles, setSearchedArticles] = useState<Article[]>([])
    const [currentFilter, setCurrentFilter] = useState<ArticleFilter>(
        {
            page: 1,
            pageSize: 10,
            dateSortType: 1,
            categoryFilters: []
        }
    )
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        refresh();
    }, []);

    useEffect(() => {
        fetchSearchedArticles();
    }, [currentFilter])

    useEffect(() => {
        if (articleGroupContext){
        for (var gI of articleGroupContext.groupItems){
            getArticle(gI.articleId)
        }
    }
    },[articleGroupContext, articleGroupContext?.groupItems])

    async function fetchArticle(id: number){
        var resp = await fetch(`${API_URL}/articles/get/${id}`)
        var data: Article = await resp.json();        
        return data;
    }

    async function getArticle(id : number){
        try{
            if (articles[id])
                return articles[id]
            if (await pendingArticles[id])
                return pendingArticles[id];

            pendingArticles[id] = fetchArticle(id).then(a => {
                setArticles(prev => ({...prev, [id]:a}))
                delete pendingArticles[id]
                return a;
            })

        }
        catch(Err){
            console.error(Err);
        }
    }

    async function fetchSearchedArticles() {
        try {
            var resp = await fetch(`${API_URL}/articles/get`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(currentFilter)
            })
            if (resp.body && resp.ok) {
                var data = await resp.json();
                setSearchedArticles(data);
            }
            setIsLoading(!resp.ok)
            return false;
        }
        catch (err) {
            console.error(err);
            setIsLoading(true);
            return true;
        }

    }

    async function createArticle(formData: ArticleFormData) {
        try {
            var resp = await fetch(`${API_URL}/articles/publish`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(formData)
            });

            if (resp.ok)
                refresh()
            
        } catch (err) {
            console.log(err);
        }


    }

    async function deleteArticle(id : number) {     
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Unauthorized action");
          return false;
        }
        var resp = await fetch(`${API_URL}/articles/delete/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return(resp.ok)
    }  
        
    



    function setFilter(filter: ArticleFilter) {
        setCurrentFilter(filter);
    }

    async function refresh() {
        fetchSearchedArticles();
    }

    return (<ArticleContext.Provider value={{ articles, searchedArticles, currentFilter,isLoading, refresh, setFilter, createArticle, deleteArticle }}>{children}</ArticleContext.Provider>)

}