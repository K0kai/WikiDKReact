import { queryOptions } from "@tanstack/react-query"
import type { Category } from "../../types/category";

const API_URL = import.meta.env.VITE_API_URL

export function createMultipleCategoriesQueryOptions(ids: string){
    return queryOptions({
        queryKey:["categories", ids],
        queryFn:() => fetchSelectCategories(),
    })

    async function fetchSelectCategories() : Promise<Category[]>{
        try{
            const resp = await fetch(`${API_URL}/categories/by-ids?ids=${ids}`);
            return await resp.json();
        }
        catch (Err){
            console.log(Err);
            return []
        }
    }
}

export function createCategoryQueryOptions(){
    return queryOptions({
        queryKey:["categories"],
        queryFn:() => fetchCategories(),
        staleTime:360000
    })

    async function fetchCategories(): Promise<Category[]>{
        try {
            const resp = await fetch(`${API_URL}/categories`);
            return await resp.json();
        } catch (err) {
            console.error(err);
            return []
        }
    }
}