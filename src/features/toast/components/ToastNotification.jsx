import { Check, Info, AlertCircle } from 'lucide-react';

export const ToastNotification = ({ toasts = [] }) => {
  if (toasts.length === 0) return null;

  return (
    <aside
      aria-label="Notifications"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            role="status"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-zinc-900/95 border border-zinc-800 text-xs text-zinc-200 shadow-xl shadow-black/40 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-150"
          >
            {isSuccess && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
            {isWarning && <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
            {!isSuccess && !isWarning && <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
            <span className="font-medium tracking-tight">{toast.message}</span>
          </div>
        );
      })}
    </aside>
  );
};
