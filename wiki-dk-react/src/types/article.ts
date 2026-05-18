export type Article = {
    id: number;
    title: string;
    description: string;
    content: string;
    created: string;
    updated: string;
    authorId: number;
    lastEditorId: number;
    thumbnailLink: string;
    categories: number[];    
}

export type ArticleFilter = {
    page: number;
    pageSize: number;
    dateSortType: DateSortType;
    categoryFilters: number[]
}

export type CategoryFilter = {
    id: number,
    value: boolean,
}

export const DateSortType = {
    None: 0,
    UpdatedNewest: 1,
    UpdatedOldest: 2,
    CreatedOldest: 3,
    CreatedNewest: 4
}

export type DateSortType = (typeof DateSortType)[keyof typeof DateSortType];
