import type { Rank, RankCreateRequest } from "../context/RankContext";

const API_URL = import.meta.env.VITE_API_URL

export async function createRank(request: RankCreateRequest) {
    var formData = new FormData();
    var token = localStorage.getItem("token")
    formData.append("Name", request.name);
    formData.append("Description", request.description)
    if (request.image)
        formData.append("Icon", request.image);

    var resp = await fetch(`${API_URL}/ranks`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData
    })


    var data: Rank = await resp.json();
    return data;

}

export async function deleteRank(id: number) {
    var token = localStorage.getItem("token")
    var resp = await fetch(`${API_URL}/ranks/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return resp.ok
}