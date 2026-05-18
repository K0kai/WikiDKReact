import type { ArticleGroup } from "../types/articleGroup"

const API_URL = import.meta.env.VITE_API_URL

export async function groupArticle(articleId: number, groupId: number) {
    var resp = await fetch(`${API_URL}/articles/group/${articleId}:${groupId}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        }
    })
    return resp.ok
}

export async function ungroupArticle(articleId: number, groupId: number) {
    var resp = await fetch(`${API_URL}/ungroup/${articleId}:${groupId}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        }
    })
    return resp.ok
}

export async function createGroup(title: string, description: string, displayHome: boolean, displaySidebar: boolean) {
    var resp = await fetch(`${API_URL}/articles/group`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, description, displayHome, displaySidebar })
    })
    if (resp.ok) {
        var group: ArticleGroup = await resp.json();
        return group;
    }
    else {
        console.error(`${resp.status} ${resp.statusText}`)
    }
    return resp.ok;
}

export async function updateGroup(groupId: number, title: string, description: string, displayHome: boolean, displaySidebar: boolean) {
    var resp = await fetch(`${API_URL}/articles/group/update/${groupId}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, description, displayHome, displaySidebar })
    })
    return resp.ok;
}