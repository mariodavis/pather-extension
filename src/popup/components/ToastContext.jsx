import { createContext, useCallback, useContext, useRef, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [message, setMessage] = useState(null);
  const timeoutRef = useRef(null);

  const showToast = useCallback((text) => {
    window.clearTimeout(timeoutRef.current);
    setMessage(text);
    timeoutRef.current = window.setTimeout(() => setMessage(null), 1600);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {message && (
        <div className="pointer-events-none fixed bottom-16 left-1/2 -translate-x-1/2 bg-ink text-white text-xs font-medium px-3.5 py-2 rounded-full shadow-lg z-50">
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
