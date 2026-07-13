"use client";
import React from "react";
import { useOrderModal } from "@/context/ModalContext";
import { productCategories } from "@/data/catalog";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const FilterSidebar = () => {
  const { openModal } = useOrderModal();

  return (
    <aside className="w-full lg:w-80 shrink-0">
      <Card hoverable={false} className="p-10 sticky top-32 overflow-visible border-white bg-white/50">
        <h3 className="text-[10px] font-black text-brand-muted uppercase tracking-[0.3em] mb-12 opacity-60">Фильтрация</h3>
        <div className="space-y-12">
          <div>
            <h4 className="text-[13px] font-black text-brand-dark mb-6 tracking-wide">Категории</h4>
            <div className="flex flex-wrap gap-2">
              {productCategories.map((c, i) => (
                <button 
                  key={c} 
                  className={`px-5 py-3 rounded-xl text-[12px] font-black transition-all border ${i === 0 ? "bg-brand-dark text-white border-brand-dark shadow-xl" : "bg-white text-slate-500 border-slate-100 hover:border-brand-primary/30"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          
          <div className="pt-8 border-t border-brand-border/40">
            <h4 className="text-[13px] font-black text-brand-dark mb-6 tracking-wide">Наличие на складе</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-6 h-6 rounded-xl border-2 border-brand-primary bg-brand-primary text-white flex items-center justify-center text-[10px] font-black">✓</div>
                <span className="text-[14px] font-bold text-slate-600 group-hover:text-brand-primary transition-colors">Бишкек (В наличии)</span>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-6 h-6 rounded-xl border-2 border-slate-200 group-hover:border-brand-primary/40 transition-colors"></div>
                <span className="text-[14px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors">Под спецзаказ</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={() => openModal()} 
            variant="primary" 
            className="w-full py-6 text-sm"
          >
            Запросить спецификацию
          </Button>
        </div>
      </Card>
    </aside>
  );
};
