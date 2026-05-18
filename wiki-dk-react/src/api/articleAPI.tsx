import type { ArticleSubmissionRequest } from "../types/dto/articleSubmission";

const API_URL = import.meta.env.VITE_API_URL;

export async function submitArticle(form: ArticleSubmissionRequest) {
    var formData = new FormData();
    formData.append("title", form.title);
    formData.append("articleId", form.articleId?.toString() ?? "");
    formData.append("submitterId", form.submitterId?.toString() ?? "");
    formData.append("submitterName", form.submitterName ?? "");
    formData.append("content", form.content ?? "");
    formData.append("type", form.type);

    form.categories?.forEach(c => formData.append("categories", c.toString()));
    form.groups?.forEach(g => formData.append("groups", g.toString()));

    if (form.thumbnailFile) {
        formData.append("thumbnailFile", form.thumbnailFile);
    }
    var resp = await fetch(`${API_URL}/articles/submissions`, {
        method: "POST",
        body: formData
    })
    return JSON.stringify({ status: resp.status, message: resp.statusText })
}

export async function processSubmission(subId: number) {
    var token = localStorage.getItem("token");
    var resp = await fetch(`${API_URL}/articles/submissions/process/${subId}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return JSON.stringify({ status: resp.status, message: resp.statusText })
}

export async function rejectSubmission(subId: number) {
    var token = localStorage.getItem("token");
    var resp = await fetch(`${API_URL}/articles/submissions/reject/${subId}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return JSON.stringify({ status: resp.status, message: resp.statusText })
}

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