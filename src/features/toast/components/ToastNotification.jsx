import { Check, Info, AlertCircle } from 'lucide-react';

export const ToastNotification = ({ toasts = [] }) => {
  if (toasts.length === 0) return null;

  return (
    <aside
      aria-label="Notifications"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            role="status"
            className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1c1f23]/95 border border-white/20 text-xs font-mono-tech tracking-wider text-slate-200 shadow-2xl shadow-black/60 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-150 uppercase"
          >
            {isSuccess && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
            {isWarning && <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
            {!isSuccess && !isWarning && <Info className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
            <span className="font-medium">{toast.message}</span>
          </div>
        );
      })}
    </aside>
  );
};
