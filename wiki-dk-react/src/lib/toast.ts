import type { ToastType } from "../hooks/useToast";

type ToastFn = (title: string, message: string, type?: ToastType) => void;

let _toast: ToastFn | null = null;

export function registerToast(fn: ToastFn) {
  _toast = fn;
}

export function toast(title: string, message: string, type: ToastType = "info") {
  if (_toast) _toast(title, message, type);
  else console.warn("Toast not registered yet:", title);
}