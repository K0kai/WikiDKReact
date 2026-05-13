import type { ArticleGroup } from "./articleGroup"

export type ArticleGroupItem={
    id: number
    articleGroupId: number
    articleGroup: ArticleGroup | null
    articleId: number
    position: number
    
}
