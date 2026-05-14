import { createContext, useEffect, useState, type ReactNode } from "react"

export type Rank = {
    id: number
    name: string
    description: string
    icon: string
}
export type RankCreateRequest = {
    name: string
    description: string
    image: File | null
}

type RanksContextType = {
    ranks: Rank[]
    createRank: (rank: RankCreateRequest) => Promise<boolean>
    deleteRank: (id: number) => Promise<boolean>
    getRanks: () => Promise<boolean>
}

export const RanksContext = createContext<RanksContextType | undefined>(undefined)

const API_URL = import.meta.env.VITE_API_URL

export function RankProvider({ children }: { children: ReactNode }) {
    const [ranks, setRanks] = useState<Rank[]>([])
    const token = localStorage.getItem("token");

    async function createRank(request: RankCreateRequest) {
        var formData = new FormData();

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

        if (resp.ok){
            var data : Rank = await resp.json();
            setRanks([...ranks, data])
        }

        return resp.ok
    }

    useEffect(() => {
        getRanks();
    },[])

    async function deleteRank(id: number) {
        var resp = await fetch(`${API_URL}/ranks/${id}`, {
            method:"DELETE",
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        return resp.ok
    }

    async function getRanks() {
        var resp = await fetch(`${API_URL}/ranks`)
        var ranks: Rank[] = await resp.json();
        setRanks(ranks);
        return resp.ok
    }

    return <RanksContext.Provider value={{ranks, createRank, deleteRank, getRanks}}>{children}</RanksContext.Provider>
}