"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

interface Toast { id: number; message: string; type: "success" | "error" }
interface AdminCtx { toast: (msg: string, type?: Toast["type"]) => void; newOrders: number; refreshOrders: () => void }

const Ctx = createContext<AdminCtx>({ toast: () => {}, newOrders: 0, refreshOrders: () => {} });
export const useAdmin = () => useContext(Ctx);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts]     = useState<Toast[]>([]);
  const [newOrders, setNewOrders] = useState(0);

  const refreshOrders = useCallback(() => {
    fetch("/api/admin/orders").then(r => r.json()).then((data: { status: string }[]) =>
      setNewOrders(data.filter(o => o.status === "new").length)
    ).catch(() => {});
  }, []);

  useEffect(() => { refreshOrders(); }, [refreshOrders]);

  const toast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }, []);

  return (
    <Ctx.Provider value={{ toast, newOrders, refreshOrders }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-[13px] font-semibold text-white animate-slide-up pointer-events-auto ${t.type === "error" ? "bg-red-500" : "bg-gray-900"}`}>
            {t.type === "error"
              ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6 9 17l-5-5"/></svg>
            }
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
