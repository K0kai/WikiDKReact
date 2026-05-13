import type { ArticleGroupItem } from "./articleGroupItem"

export type ArticleGroup={
    id: number
    title: string
    description: string
    items: ArticleGroupItem[] | null
    locked: boolean
    displayOnHome: boolean
    displayOnSidebar: boolean
}