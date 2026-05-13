import { createContext } from "react"
import type { ArticleGroup } from "../types/articleGroup"
import type { ArticleGroupItem } from "../types/articleGroupItem"
import { useEffect, useState } from "react"

const API_URL = import.meta.env.VITE_API_URL


type ArticleGroupContext={
    groups: ArticleGroup[]
    groupItems: ArticleGroupItem[]
    refresh:() => Promise<void>
    groupArticle:(articleId: number, groupId: number) => Promise<boolean>
    ungroupArticle:(articleId: number, groupId: number) => Promise<boolean>
    createGroup:(title: string, description: string, displayHome: boolean, displaySidebar: boolean) => Promise<boolean>
    updateGroup:(groupId: number, title: string, description: string, displayHome: boolean, displaySidebar: boolean) => Promise<boolean>
}

export const ArticleGroupContext = createContext<ArticleGroupContext | null>(null)

export function ArticleGroupProvider({children} : {children: React.ReactNode}){
    const [groups, setGroups] = useState<ArticleGroup[]>([])
    const [groupItems, setGroupItems] = useState<ArticleGroupItem[]>([])

    async function refresh(){
        var groupsResp = await fetch(`${API_URL}/articles/groups`)
        if (groupsResp.ok){
            var groups : ArticleGroup[] = await groupsResp.json();
            setGroups(groups);
        }
        else{
            console.error(`Error at group context: ${groupsResp.status} ${groupsResp.statusText}`)
        }
    }

    async function populateGroupItems(){
        var items  = groups.flatMap(g => g.items).filter(g => g != null)
        setGroupItems(items);
    }

    useEffect(() => {
        refresh();
    },[])
    useEffect(() => {
        populateGroupItems();
    }, [groups])

    async function groupArticle(articleId: number, groupId: number){
        var resp = await fetch(`${API_URL}/articles/group/${articleId}:${groupId}`, {
            method:"POST",
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`,
                "Content-Type":"application/json"
            }
        })
        return resp.ok
    }

    async function ungroupArticle(articleId: number, groupId: number){
        var resp = await fetch(`${API_URL}/ungroup/${articleId}:${groupId}`, {
            method:"POST",
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`,
                "Content-Type":"application/json"
            }
        })
        return resp.ok
    }

    async function createGroup(title: string, description: string, displayHome: boolean, displaySidebar: boolean){
        var resp = await fetch(`${API_URL}/articles/group`,{
            method:"POST",
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`,
                "Content-Type":"application/json"
            },
            body: JSON.stringify({title, description, displayHome, displaySidebar})
        })
        if (resp.ok){
            var group : ArticleGroup = await resp.json();
            setGroups([...groups,group] )
        }
        else{
            console.error(`${resp.status} ${resp.statusText}`)
        }
        return resp.ok;
    }

    async function updateGroup(groupId:number, title: string, description: string, displayHome: boolean, displaySidebar: boolean){
        var resp = await fetch(`${API_URL}/articles/group/update/${groupId}`,{
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, description, displayHome, displaySidebar })
        })
        if (resp.ok) {
            refresh()
        }
        else {
            console.error(`${resp.status} ${resp.statusText}`)
        }
        return resp.ok;
    }

    return (<ArticleGroupContext.Provider value={{ groups, groupItems, refresh, groupArticle, ungroupArticle, createGroup, updateGroup }}>{children}</ArticleGroupContext.Provider>)


}