"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useAdmin } from "../_components/AdminContext";

interface SubcategoryNode { name: string; count: number }
interface CategoryNode { name: string; icon: string; productCount: number; subcategories: SubcategoryNode[] }

const inp = "w-full border border-slate-200 rounded-xl px-3 py-2 text-[13px] outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 bg-white transition-colors";

const PencilIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
);
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
);

export default function AdminCategoriesPage() {
  const { toast } = useAdmin();
  const [tree, setTree] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const [newCat, setNewCat] = useState("");
  // Инлайн-редактирование: cat:<имя> или sub:<имя>
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [moveTarget, setMoveTarget] = useState("");

  const load = useCallback(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => { setTree(d.categories); setLoading(false); })
      .catch(() => { toast("Не удалось загрузить категории", "error"); setLoading(false); });
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  async function api(method: string, url: string, body: unknown): Promise<boolean> {
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast(data.error || "Ошибка операции", "error");
      return false;
    }
    return true;
  }

  async function addCategory() {
    const name = newCat.trim();
    if (!name) return;
    if (await api("POST", "/api/admin/categories", { name })) {
      toast("Категория создана");
      setNewCat("");
      load();
    }
  }

  async function renameCategory(oldName: string) {
    const newName = editValue.trim();
    setEditing(null);
    if (!newName || newName === oldName) return;
    if (await api("PUT", "/api/admin/categories", { oldName, newName })) {
      toast("Категория переименована — товары обновлены");
      load();
    }
  }

  async function deleteCategory(name: string, count: number) {
    if (count > 0) {
      toast(`В категории ${count} товаров — сначала перенесите или удалите их`, "error");
      return;
    }
    if (!confirm(`Удалить категорию «${name}»?`)) return;
    if (await api("DELETE", "/api/admin/categories", { name })) {
      toast("Категория удалена");
      load();
    }
  }

  async function renameSubcategory(oldName: string) {
    const newName = editValue.trim();
    setEditing(null);
    if (!newName || newName === oldName) return;
    if (await api("PUT", "/api/admin/subcategories", { oldName, newName })) {
      toast("Подкатегория переименована — товары обновлены");
      load();
    }
  }

  async function moveSubcategory(name: string, toCategory: string) {
    if (!toCategory) return;
    if (!confirm(`Перенести «${name}» в категорию «${toCategory}»?`)) return;
    if (await api("PUT", "/api/admin/subcategories", { oldName: name, moveToCategory: toCategory })) {
      toast("Подкатегория перенесена");
      setMoveTarget("");
      load();
    }
  }

  async function deleteSubcategory(name: string, count: number) {
    if (!confirm(`Удалить подкатегорию «${name}» вместе с ${count} товарами? Это действие необратимо.`)) return;
    if (await api("DELETE", "/api/admin/subcategories", { name })) {
      toast(`Удалено товаров: ${count}`);
      load();
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-[13px]">
        <svg className="animate-spin mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        Загрузка...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 max-w-4xl">
      <div>
        <h1 className="text-[24px] font-bold text-slate-900 tracking-tight">Категории</h1>
        <p className="text-[13px] text-slate-500 mt-0.5">
          Переименование каскадно обновляет все товары. Подкатегории определяют разделы каталога и калькулятор.
        </p>
      </div>

      {/* Добавить категорию */}
      <div className="flex gap-2 max-w-md">
        <input
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCategory()}
          className={inp}
          placeholder="Новая категория..."
        />
        <button
          onClick={addCategory}
          className="shrink-0 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[13px] px-4 py-2 rounded-xl transition-colors"
        >
          Добавить
        </button>
      </div>

      {/* Список категорий */}
      <div className="flex flex-col gap-2">
        {tree.map((cat) => {
          const isOpen = open === cat.name;
          const catKey = `cat:${cat.name}`;
          return (
            <div key={cat.name} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {/* Строка категории */}
              <div className="flex items-center gap-2 px-4 py-3">
                <button
                  onClick={() => setOpen(isOpen ? null : cat.name)}
                  className="flex items-center gap-2 flex-1 min-w-0 text-left group"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                    className={`shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-90" : ""}`} aria-hidden>
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                  {editing === catKey ? (
                    <input
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") renameCategory(cat.name); if (e.key === "Escape") setEditing(null); }}
                      onBlur={() => renameCategory(cat.name)}
                      onClick={(e) => e.stopPropagation()}
                      className={`${inp} max-w-xs py-1`}
                    />
                  ) : (
                    <span className="text-[14px] font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{cat.name}</span>
                  )}
                  <span className="shrink-0 px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[11px] font-semibold">
                    {cat.subcategories.length} подкат. · {cat.productCount} тов.
                  </span>
                </button>
                <button
                  onClick={() => { setEditing(catKey); setEditValue(cat.name); }}
                  className="p-1.5 rounded-xl text-blue-500 hover:bg-blue-50 transition-colors" title="Переименовать">
                  <PencilIcon />
                </button>
                <button
                  onClick={() => deleteCategory(cat.name, cat.productCount)}
                  className={`p-1.5 rounded-xl transition-colors ${cat.productCount > 0 ? "text-slate-200 cursor-not-allowed" : "text-red-400 hover:bg-red-50 hover:text-red-600"}`}
                  title={cat.productCount > 0 ? "Категория не пуста" : "Удалить"}>
                  <TrashIcon />
                </button>
              </div>

              {/* Подкатегории */}
              {isOpen && (
                <div className="border-t border-slate-100 divide-y divide-slate-50">
                  {cat.subcategories.length === 0 && (
                    <p className="px-11 py-3 text-[12px] text-slate-400">
                      Подкатегорий нет. Они создаются при добавлении товара.
                    </p>
                  )}
                  {cat.subcategories.map((sub) => {
                    const subKey = `sub:${sub.name}`;
                    // Псевдо-узел для товаров без подкатегории — операции недоступны
                    if (sub.name === "(без подкатегории)") {
                      return (
                        <div key={sub.name} className="flex items-center gap-2 pl-11 pr-4 py-2.5">
                          <span className="text-[13px] font-medium text-slate-400 italic">{sub.name}</span>
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[10px] font-semibold">{sub.count}</span>
                        </div>
                      );
                    }
                    return (
                      <div key={sub.name} className="flex flex-wrap items-center gap-2 pl-11 pr-4 py-2.5 hover:bg-slate-50/60 transition-colors">
                        {editing === subKey ? (
                          <input
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") renameSubcategory(sub.name); if (e.key === "Escape") setEditing(null); }}
                            onBlur={() => renameSubcategory(sub.name)}
                            className={`${inp} max-w-xs py-1`}
                          />
                        ) : (
                          <span className="text-[13px] font-semibold text-slate-700">{sub.name}</span>
                        )}
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[10px] font-semibold">{sub.count}</span>
                        <div className="ml-auto flex items-center gap-1.5">
                          {/* Перенос в другую категорию */}
                          <select
                            value={moveTarget === sub.name ? "" : ""}
                            onChange={(e) => { setMoveTarget(sub.name); moveSubcategory(sub.name, e.target.value); }}
                            className="border border-slate-200 bg-white rounded-xl px-2 py-1 text-[11px] text-slate-500 outline-none focus:border-blue-400 cursor-pointer max-w-[160px]"
                          >
                            <option value="">Перенести в...</option>
                            {tree.filter((c) => c.name !== cat.name).map((c) => (
                              <option key={c.name} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => { setEditing(subKey); setEditValue(sub.name); }}
                            className="p-1.5 rounded-xl text-blue-500 hover:bg-blue-50 transition-colors" title="Переименовать">
                            <PencilIcon />
                          </button>
                          <button
                            onClick={() => deleteSubcategory(sub.name, sub.count)}
                            className="p-1.5 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Удалить с товарами">
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
