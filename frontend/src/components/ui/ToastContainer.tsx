'use client';

import { useToasts } from '@/hooks';

export function ToastContainer() {
  const toasts = useToasts();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        const borderColor =
          toast.type === 'success'
            ? 'border-green-600/50'
            : toast.type === 'error'
              ? 'border-red-600/50'
              : toast.type === 'warning'
                ? 'border-yellow-600/50'
                : 'border-[rgba(201,164,92,0.3)]';

        return (
          <div
            key={toast.id}
            className={`px-5 py-3.5 bg-[#191713] border ${borderColor} text-sm text-[#F5F0E7] shadow-xl animate-[toast-enter_0.3s_ease-out]`}
            role="alert"
          >
            {toast.message}
          </div>
        );
      })}
    </div>
  );
}
