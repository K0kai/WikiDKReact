import { queryOptions } from "@tanstack/react-query";
import { getSections } from "../../api/pageAPI";

export function createGetPageSectionsQueryOptions(){
    return queryOptions({
        queryKey:["pageSections"],
        queryFn: () => getSections(),
        staleTime: Infinity
    })

}