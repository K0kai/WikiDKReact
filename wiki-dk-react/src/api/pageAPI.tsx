import type { PageSection, PageSectionCreate } from "../types/pageSection";

const API_URL = import.meta.env.VITE_API_URL

export async function createSection(pgSectionDTO: PageSectionCreate) {
    var token = localStorage.getItem("token");
    await fetch(`${API_URL}/pages/section`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(pgSectionDTO)
    })
}

export async function getSections(): Promise<PageSection[]> {
    var resp = await fetch(`${API_URL}/pages/section`)
    return await resp.json();
}