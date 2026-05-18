const API_URL = import.meta.env.VITE_API_URL;


export const createCategory = async (name: string, description: string, icon: string | null) => {
        const resp = await fetch(`${API_URL}/categories`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, description, icon }),
        });

        console.log(resp.status);

        const newCat = await resp.json();
        return newCat;
    };

    export const deleteCategory = async (id: number) => {
        var resp = await fetch(`${API_URL}/categories/delete/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        });
        return await resp.json();
    };

    export const updateCategory = async (id: number, name: string, description: string, slug: string, icon: string) => {
        var resp = await fetch(`${API_URL}/categories/update/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name, description, slug, icon})
        });
        return await resp.json();
    }