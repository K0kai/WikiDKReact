export type PageSection={
    id: number
    title: string
    content: string
    slug: string
    order: number
    isVisible: boolean
}

export type PageSectionCreate={
    title: string
    content: string
    order: number
    isVisible: boolean
}