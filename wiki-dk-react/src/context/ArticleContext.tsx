import { createContext } from "react";
import type { Article } from "../types/article"
import { useEffect, useState, type ReactNode } from "react";
import type { ArticleFormData } from "../components/editors/ArticleForm";
import type { ArticleGroup } from "../types/articleGroup";
import type { ArticleGroupItem } from "../types/articleGroupItem";

const API_URL = import.meta.env.VITE_API_URL


export type ArticleFilter = {
    page: number;
    pageSize: number;
    dateSortType: DateSortType;
    categoryFilters: CategoryFilter[]
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
    articles: Article[];
    articleGroups: ArticleGroup[];
    articleGroupItems: ArticleGroupItem[];
    currentFilter: ArticleFilter;
    refresh: () => Promise<void>;
    setFilter: (filter: ArticleFilter) => void;
    createArticle: (formData: ArticleFormData) => Promise<void>;
    deleteArticle:(id: number) => Promise<boolean>;
    groupArticle: (articleId: number, groupId: number) => Promise<boolean>
    ungroupArticle: (articleId: number, groupId: number) => Promise<boolean>
    //updateArticle(title: string, content: string, thumbnailLink: string): () => Promise<void>;
    //deleteArticle(id: number): () => Promise<void>;

}

export const ArticleContext = createContext<ArticleContextType | null>(null)

export function ArticleProvider({ children }: { children: ReactNode }) {
    const [articles, setArticles] = useState<Article[]>([]);
    const [articleGroups, setArticleGroups] = useState<ArticleGroup[]>([])
    const [articleGroupItems, setArticleGroupItems] = useState<ArticleGroupItem[]>([])
    const [currentFilter, setCurrentFilter] = useState<ArticleFilter>(
        {
            page: 1,
            pageSize: 10,
            dateSortType: 1,
            categoryFilters: []
        }
    )

    useEffect(() => {
        refresh();
    }, []);

    async function fetchArticles() {
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
                setArticles(data);
            }
        }
        catch (err) {
            console.error(err);
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

    async function groupArticle(articleId: number) {
        var resp = await fetch(`${API_URL}/articles/highlight/${articleId}`, 
            {method:"POST",
            headers:{
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type":"application/json"
            }

            },
        )
        var data : ArticleGroupItem = await resp.json();
        if (resp.ok) {
            setArticleGroupItems([...articleGroupItems, data])
            return true
        }
        else
            return false
    }

    async function ungroupArticle(articleId: number, groupId: number){
         var resp = await fetch(`${API_URL}/articles/unhighlight/${articleId}`, 
            {method:"POST",
            headers:{
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type":"application/json"
            }

            },
        )

        if (resp.ok) {
            var newArray = articleGroupItems.filter(hArt => hArt.articleId != articleId && hArt.articleGroupId != groupId)
            setArticleGroupItems(newArray);
            return true
        }
        else
            return false
    }
        
    

    async function fetchArticleGroups(){
        var resp = await fetch (`${API_URL}/articles/groups`)
        if (resp.ok){
            var data : ArticleGroup[] = await resp.json();
            setArticleGroups(data)
        }
        else{
            console.error(`Failed to fetch highlights: ${resp.status} ${resp.statusText}`)
        }
    }

    function setFilter(filter: ArticleFilter) {
        setCurrentFilter(filter);
    }

    async function refresh() {
        fetchArticles();
        fetchArticleGroups();
    }

    return (<ArticleContext.Provider value={{ articles, articleGroups,articleGroupItems, currentFilter, refresh, setFilter, createArticle, deleteArticle, groupArticle, ungroupArticle }}>{children}</ArticleContext.Provider>)

}