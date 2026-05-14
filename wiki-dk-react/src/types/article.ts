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