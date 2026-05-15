import { queryOptions } from "@tanstack/react-query";
import type { otherUser } from "../../api/userAPI";

const API_URL = import.meta.env.VITE_API_URL

export function createSingleUserQueryOptions(id :number){

    return queryOptions({
        queryKey:["user", id],
        queryFn: () => getUser(),
        staleTime:Infinity
    })

    async function getUser() : Promise<otherUser> {
    var resp = await fetch(`${API_URL}/users/${id}`)
    var data: otherUser = await resp.json();
    return data;
}

}



