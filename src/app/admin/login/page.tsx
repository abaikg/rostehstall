"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Неверный пароль");
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
      {/* Фоновые блюры */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-[400px]">
        {/* Логотип */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="3" y="3" width="8" height="8" rx="1.5" fill="white" opacity="0.9"/>
                <rect x="13" y="3" width="8" height="8" rx="1.5" fill="white" opacity="0.6"/>
                <rect x="3" y="13" width="8" height="8" rx="1.5" fill="white" opacity="0.6"/>
                <rect x="13" y="13" width="8" height="8" rx="1.5" fill="white" opacity="0.9"/>
              </svg>
            </div>
            <span className="text-white font-bold text-[20px] tracking-tight">Ростехсталь</span>
          </div>
          <p className="text-gray-500 text-[14px]">Панель управления</p>
        </div>

        {/* Карточка */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <h1 className="text-white font-bold text-[22px] mb-1">Вход</h1>
          <p className="text-gray-400 text-[13px] mb-6">Введите пароль для доступа к панели</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Логин</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                autoFocus
                autoComplete="username"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[15px] text-white placeholder:text-gray-600 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[15px] text-white placeholder:text-gray-600 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" aria-hidden>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span className="text-[13px] text-red-400 font-medium">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all text-[15px] mt-1"
            >
              {loading ? "Вход..." : "Войти"}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-[12px] mt-6">
          Ростехсталь © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
