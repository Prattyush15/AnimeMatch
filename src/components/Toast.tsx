"use client";
import * as React from 'react';

type ToastAction = { label: string; onClick: () => void };
type ToastMessage = { id: number; text: string; action?: ToastAction; action2?: ToastAction };

type ToastContextValue = {
  toast: (text: string, action?: ToastAction, action2?: ToastAction) => void;
};

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = React.useState<ToastMessage[]>([]);
  const idRef = React.useRef(0);

  const toast = (text: string, action?: ToastAction, action2?: ToastAction) => {
    const id = ++idRef.current;
    setMessages(prev => [...prev, { id, text, action, action2 }]);
    window.setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== id));
    }, 1600);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div aria-live="polite" aria-atomic="true" className="pointer-events-none fixed top-20 right-4 z-[60] px-4">
        <div className="flex max-w-sm flex-col gap-2">
          {messages.map(m => (
            <div key={m.id} role="status" className="pointer-events-auto flex items-center justify-between gap-3 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-md">
              <span>{m.text}</span>
              <div className="flex items-center gap-2">
                {m.action && (
                  <button className="rounded border px-2 py-1 text-xs hover:bg-gray-50" onClick={m.action.onClick}>{m.action.label}</button>
                )}
                {m.action2 && (
                  <button className="rounded border px-2 py-1 text-xs hover:bg-gray-50" onClick={m.action2.onClick}>{m.action2.label}</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}


