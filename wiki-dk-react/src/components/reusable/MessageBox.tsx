import './/MessageBox.css'

type MessageType = "success" | "error" | "info" | "warning";

type MessageBoxProps = {
  title?: string;
  message: string;
  type?: MessageType;
  onConfirm?: () => void;
  onClose?: () => void;
  confirmText?: string;
};

export default function MessageBox({
  title,
  message,
  type = "info",
  onConfirm,
  onClose,
  confirmText = "OK"
}: MessageBoxProps) {
  return (
    <div className={`message-box ${type}`}>
      {title && <h2 className="message-title">{title}</h2>}

      <p className="message-content">{message}</p>

      <div className="message-actions">
        {onClose && (
          <button className="btn secondary" onClick={onClose}>
            Cancelar
          </button>
        )}

        <button
          className="btn primary"
          onClick={onConfirm ?? onClose}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}