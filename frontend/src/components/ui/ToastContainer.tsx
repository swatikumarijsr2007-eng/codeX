import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export function ToastContainer() {
  const { toasts, removeToast } = useCrm();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.variant === 'success';
        const isWarning = toast.variant === 'warning';
        const isError = toast.variant === 'error';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-xl animate-fade-in transition-all duration-200 bg-white dark:bg-slate-900/95 border-slate-200/90 dark:border-white/[0.1] text-slate-800 dark:text-slate-100 shadow-slate-900/10 dark:shadow-black/50"
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              {isWarning && <AlertTriangle className="w-4 h-4 text-amber-500" />}
              {isError && <AlertCircle className="w-4 h-4 text-rose-500" />}
              {!isSuccess && !isWarning && !isError && <Info className="w-4 h-4 text-blue-500" />}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <p className="text-xs font-semibold tracking-tight text-slate-900 dark:text-white">
                {toast.title}
              </p>
              {toast.description && (
                <p className="text-xs mt-0.5 text-slate-600 dark:text-slate-400 leading-relaxed truncate">
                  {toast.description}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
