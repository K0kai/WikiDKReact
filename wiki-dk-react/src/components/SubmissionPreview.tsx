import { useLocation } from "react-router-dom";
import type { ArticleSubmission } from "../types/articleSubmission";
import "./SubmissionPreview.css"
import ReactMarkdown from "react-markdown";
import { useQuery } from "@tanstack/react-query";
import { createSingleUserQueryOptions } from "./query_options/userQueryOptions";
import { createMultipleCategoriesQueryOptions } from "./query_options/categoryQueryOptions";
import { createMultipleArticleGroupQueryOptions } from "./query_options/articleGroupQueryOptions";

export function SubmissionPreviewPage() {
  const location = useLocation();
  const submission = location.state as ArticleSubmission;
  const userQuery = useQuery(createSingleUserQueryOptions(submission.submitterId ?? -1))
  const categoryIds = submission.categories?.join(',')
  const categories = useQuery(createMultipleCategoriesQueryOptions(categoryIds ?? ""))
  const groupIds = submission.groups?.join(',')
  const groups = useQuery(createMultipleArticleGroupQueryOptions(groupIds ?? ""));

  if (!submission) {
    return <div className="preview-error">Nenhuma submissão encontrada.</div>;
  }

  return (
    <div className="preview-container">
      <div className="preview-article">
        {submission.articleThumbnail && (
          <img
            src={submission.articleThumbnail}
            alt="thumbnail"
            className="preview-thumbnail"
          />
        )}

        <h1 className="preview-title">{submission.title}</h1>

        <div className="preview-meta">
          <span>por: {<img className="margin-left5 smallicon circular" src={userQuery.data?.userIcon} />} {submission.submitterName}</span>
          <span>•</span>
          <span>{new Date(submission.submittedAt).toLocaleString()}</span>
        </div>

        {submission.description && (
          <p className="preview-description">
            {submission.description}
          </p>
        )}
        <div className="preview-content">
          <ReactMarkdown>{submission.content}</ReactMarkdown>
        </div>
        <div className="preview-categories">
          <h2>Categorias:</h2>
          {categories.data?.map(cat => <div key={cat.id}>
            <img className="smallicon" src={cat.icon} /> {cat.name}
          </div>)}
        </div>
        <div className="preview-groups">
          <h2>Grupos:</h2>
          {groups.data?.map(gr => <div key={gr.id}>
            {gr.title}
          </div>)}
        </div>
      </div>
    </div>
  );
}

export default SubmissionPreviewPage