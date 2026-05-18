import { useQuery, useQueryClient } from "@tanstack/react-query";
import { translateTypeToLanguage, type ArticleSubmission } from "../types/articleSubmission";
import { createArticleSubmissionCountQueryOptions, createArticleSubmissionsQueryOptions, useRejectSubmission } from "./query_options/articleSubmissionsQueryOptions";
import { useState } from "react";
import './Submissions.css'
import { useNavigate } from "react-router-dom";
import { processSubmission } from "../api/articleAPI";

interface SubmissionCardProps {
  submission: ArticleSubmission;
  onApprove: (id: number) => void;
  onPreview?: (submission: ArticleSubmission) => void; // optional for now
}

export function SubmissionCard({
  submission,
  onApprove,
  onPreview
}: SubmissionCardProps) {
  const formattedDate = new Date(submission.submittedAt).toLocaleString();
  const [rejectState, setRejectState] = useState<number>(0)
  var reject = useRejectSubmission();

  async function handleReject() {
    if (rejectState === 0) {
      setRejectState(1);

      setTimeout(() => {
        setRejectState(0);
      }, 2000);

      return;
    }
    reject.mutate(submission.id);
  }

  return (
    <div className="submission-card">
      <div className="submission-card-header">
        <div className="submission-type">{translateTypeToLanguage(submission.type, "pt")?.toUpperCase()}</div>
        <div className="submission-date">{formattedDate}</div>
      </div>

      <h3 className="submission-title">{submission.title}</h3>

      {submission.description && (
        <p className="submission-description">{submission.description}</p>
      )}

      <div className="submission-footer">
        <span className="submission-author">
          por {submission.submitterName}
        </span>

        <div className="submission-actions">
          <button
            className="preview-btn"
            onClick={() => onPreview?.(submission)}
          >
            Visualizar
          </button>

          <button
            className="approve-btn"
            onClick={() => onApprove(submission.id)}
          >
            Aprovar
          </button>

          <button
            className="reject-btn"
            onClick={handleReject}
          >
            {reject.isPending ? (<img className="smallicon" src="https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/ring-resize-white-36.svg"/>) : (<>{(rejectState == 0) ? `Rejeitar` : `Confirmar`}</>)}
            
          </button>
        </div>
      </div>
    </div>
  );
}

function Submissions() {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10);
  var submissionsQuery = useQuery(createArticleSubmissionsQueryOptions(page, pageSize))
  const queryClient = useQueryClient();


  async function handleApprove(id: number) {
    await processSubmission(id)
    queryClient.invalidateQueries(submissionsQuery)
    queryClient.invalidateQueries({ queryKey: createArticleSubmissionCountQueryOptions().queryKey })
    submissionsQuery.refetch();
  }

  return <div className="submissions-container">
    <h2>Submissões da Comunidade:</h2>
    <div className="submissions-pagebox">
      {(submissionsQuery.data?.length ?? 0) > 0 ? (submissionsQuery.data?.map(s => <SubmissionCard key={s.id} submission={s} onApprove={handleApprove} onPreview={() => navigate("/preview", { state: s })} />)) : (<p className="empty-notif">Hmmm... pelo visto não tem nada aqui ainda</p>)}
    </div>
    <div className="submissions-search-options">
      Página: <input className="nooutline" type="number" onChange={(e) => setPage(Number(e.target.value))} defaultValue={1} min={1} />
      Tamanho: <input className="nooutline" type="number" onChange={(e) => setPageSize(Number(e.target.value))} defaultValue={10} min={10} max={20} />
    </div>

  </div>
}

export default Submissions;