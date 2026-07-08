"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AdminProvider, useAdmin } from "./_components/AdminContext";

const NAV = [
  { href: "/admin",          label: "Дашборд",  exact: true,
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { href: "/admin/orders",   label: "Заявки",   badge: true,
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
  { href: "/admin/products", label: "Товары",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="m7.5 4.27 9 5.15M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/></svg> },
  { href: "/admin/blog",     label: "Блог",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
];

function Sidebar() {
  const pathname    = usePathname();
  const router      = useRouter();
  const { newOrders } = useAdmin();
  const [out, setOut] = React.useState(false);

  async function logout() {
    setOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-[220px] shrink-0 bg-slate-900 flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/[0.07]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-md shadow-blue-600/40">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="3" y="3" width="8" height="8" rx="1.5" fill="white" opacity="0.95"/>
              <rect x="13" y="3" width="8" height="8" rx="1.5" fill="white" opacity="0.45"/>
              <rect x="3" y="13" width="8" height="8" rx="1.5" fill="white" opacity="0.45"/>
              <rect x="13" y="13" width="8" height="8" rx="1.5" fill="white" opacity="0.95"/>
            </svg>
          </div>
          <div className="leading-none">
            <div className="text-white font-bold text-[13px]">Ростехсталь</div>
            <div className="text-slate-500 text-[11px] mt-0.5">Панель управления</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 p-3 flex-1 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-3 pt-1 pb-2">Навигация</p>
        {NAV.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link key={item.href} href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                active ? "bg-blue-600 text-white shadow-md shadow-blue-600/25" : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              <span className={active ? "text-white" : "text-slate-500"}>{item.icon}</span>
              {item.label}
              {item.badge && newOrders > 0 && (
                <span className="ml-auto min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {newOrders > 99 ? "99+" : newOrders}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-white/[0.07] flex flex-col gap-0.5">
        <Link href="/" target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
            <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          Открыть сайт
        </Link>
        <button onClick={logout} disabled={out}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          {out ? "Выход..." : "Выйти"}
        </button>
      </div>
    </aside>
  );
}

function Topbar() {
  const pathname = usePathname();
  const current  = NAV.find((n) => (n.exact ? pathname === n.href : pathname.startsWith(n.href)));
  const sub      = pathname.split("/").length > 3;
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-2 text-[13px]">
        <span className="text-slate-400">Администратор</span>
        <span className="text-slate-300">/</span>
        <span className="font-semibold text-slate-800">{current?.label ?? "Панель"}</span>
        {sub && <><span className="text-slate-300">/</span><span className="text-slate-500">Редактирование</span></>}
      </div>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[11px]">А</div>
        <span className="text-[13px] font-semibold text-slate-700 hidden sm:block">Администратор</span>
      </div>
    </header>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
