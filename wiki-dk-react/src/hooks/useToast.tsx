import { useState, useCallback } from "react";

export type ToastType = "success" | "error" | "warn" | "info";

export type Toast = {
  id: number;
  title: string;
  message: string;
  type: ToastType;
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((title: string, message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4200);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, toast, dismiss };
}