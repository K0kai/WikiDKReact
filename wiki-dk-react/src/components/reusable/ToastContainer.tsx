import { useEffect, useState } from "react";
import { type Toast } from "../../hooks/useToast";
import "./ToastContainer.css";

const ICONS = {
  success: "✓",
  error: "✕",
  warn: "⚠",
  info: "ℹ",
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div className={`toast toast--${toast.type} ${visible ? "toast--in" : ""}`}>
      <span className="toast-icon">{ICONS[toast.type]}</span>
      <div className="toast-body">
        <div className="toast-title">{toast.title}</div>
        <div className="toast-msg">{toast.message}</div>
      </div>
      <button className="toast-close" onClick={onDismiss} aria-label="Fechar">✕</button>
      <div className="toast-bar" />
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div className="toast-root">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  );
}