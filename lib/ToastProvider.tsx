"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface Toast {
  id: string;
  title: string;
  description?: string;
}

interface ToastContextType {
  showToast: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Global toast function that can be called from anywhere
let globalShowToast: ((title: string, description?: string) => void) | null = null;

export const toast = (title: string, options?: { description?: string }) => {
  if (globalShowToast) {
    globalShowToast(title, options?.description);
  }
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((title: string, description?: string) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, title, description }]);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  // Set global function
  globalShowToast = showToast;

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container - positioned at bottom right */}
      <div className="fixed bottom-20 left-0 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ x: "-100%", y: "0", opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              exit={{ x: "-100%", y: "0", opacity: 0 }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 300,
              }}
              onClick={() => dismissToast(toast.id)}
              className="pointer-events-auto cursor-pointer"
            >
              <div className="relative w-[280px] h-[90px]">
                {/* Background Image - full size, no clipping */}
                <Image
                  src="/sonner.png"
                  alt=""
                  fill
                  className="object-contain"
                  priority
                />
                
                {/* Text Content - positioned over the image */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-8 py-4">
                  <span className="text-[#4A3728] font-bold text-lg leading-tight">
                    {toast.title}
                  </span>
                  {toast.description && (
                    <span className="text-[#4A3728]/80 text-sm font-medium">
                      {toast.description}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
