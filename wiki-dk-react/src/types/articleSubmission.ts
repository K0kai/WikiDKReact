export type ArticleSubmissionType = "create" | "update";

export interface ArticleSubmission {
  id: number;

  articleId: number | null;

  title: string;
  description: string | null;
  content: string | null;
  articleThumbnail: string | null;

  submitterId: number | null;
  submitterName: string;

  submittedAt: string; // ISO string (DateTimeOffset equivalent)

  type: ArticleSubmissionType;

  groups: number[] | null;
  categories: number[] | null;
}

export function translateTypeToLanguage(type: ArticleSubmissionType, language: string){
    switch(language){
        case "pt":
            if (type == "create")
                return "post"
            if (type == "update")
                return "edição"
            break;
        default:
            return type.toString();
    }
}