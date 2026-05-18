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