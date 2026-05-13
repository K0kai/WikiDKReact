import type { Article } from "./article"

export type HighlightedArticle={
    id: number
    articleId: number
    position: number
    createdAt: string
    expiresAt: string
    article: Article | null
}