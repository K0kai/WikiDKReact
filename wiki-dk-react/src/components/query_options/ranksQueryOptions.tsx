import { queryOptions } from "@tanstack/react-query";
import type { Rank } from "../../types/rank"

const API_URL = import.meta.env.VITE_API_URL

export function createRanksQueryOptions() {
    return queryOptions({
        queryKey: ["ranks"],
        queryFn:() => fetchRanks(),
        staleTime: 360000
    })

    async function fetchRanks() : Promise<Rank[]> {
        var resp = await fetch(`${API_URL}/ranks`)
        var ranks: Rank[] = await resp.json();
        return ranks
    }
}