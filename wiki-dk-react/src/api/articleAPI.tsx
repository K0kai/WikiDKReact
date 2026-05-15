const API_URL = import.meta.env.VITE_API_URL;

export async function deleteArticle(id: number) {
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
    return (resp.ok)
}