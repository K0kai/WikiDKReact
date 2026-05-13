import { createContext } from "react";
import type { Category } from "../types/category";
import { useEffect, useState } from "react";

type CategoryContextType = {
    categories: Category[];
    refresh: () => Promise<void>;
    createCategory: (name: string, description: string, icon: string | null) => Promise<void>;
    deleteCategory: (id: number) => Promise<void>;
    updateCategory: (id: number, name: string, description: string, slug: string, icon: string) => Promise<void>
};

export const CategoryContext = createContext<CategoryContextType | null>(null);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
    const [categories, setCategories] = useState<Category[]>([]);

    async function fetchCategories(): Promise<Category[] | undefined> {
        try {
            const resp = await fetch("http://localhost:5119/categories");
            if (!resp.ok) throw new Error("Failed to fetch categories");

            return await resp.json();
        } catch (err) {
            console.error(err);
        }
    }

    const refresh = async () => {
        const data = await fetchCategories();
        if (data) setCategories(data);
    }

    useEffect(() => {
        refresh();
    }, []);

    const createCategory = async (name: string, description: string, icon: string | null) => {
        const resp = await fetch("http://localhost:5119/categories", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, description, icon }),
        });

        console.log(resp.status);

        const newCat = await resp.json();
        setCategories(prev => [...prev, newCat]);
    };

    const deleteCategory = async (id: number) => {
        var resp = await fetch(`http://localhost:5119/categories/delete/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        });

        console.log(resp.status)

        setCategories(prev => prev.filter(c => c.id !== id));
    };

    const updateCategory = async (id: number, name: string, description: string, slug: string, icon: string) => {
        var resp = await fetch(`http://localhost:5119/categories/update/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name, description, slug, icon})
        });

        console.log(resp.status)

        refresh();
    }

    return (
        <CategoryContext.Provider
            value={{ categories, refresh, createCategory, deleteCategory, updateCategory }}
        >
            {children}
        </CategoryContext.Provider>
    );

}