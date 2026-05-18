import type { ArticleSubmissionType } from "../articleSubmission"

export interface ArticleSubmissionRequest{
    title: string
    articleId: number | null
    description: string | null
    content: string | null
    thumbnailFile: File | null
    submitterId: number | null
    submitterName: string | null    
    groups: number[] | null
    categories: number[] | null
    type : ArticleSubmissionType
}