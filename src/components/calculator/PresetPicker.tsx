"use client";
import React from "react";
import { CALCULATOR_PRESET_GROUPS, CALCULATOR_PRESET_MAP } from "@/lib/metal-calculator/config/presets";

interface PresetPickerProps {
  value: string | null;
  onChange: (presetId: string | null) => void;
  compact?: boolean;
}

export const PresetPicker = ({ value, onChange, compact = false }: PresetPickerProps) => {
  const currentPreset = value ? CALCULATOR_PRESET_MAP[value] : null;
  const labelClass = compact
    ? "text-[12px] font-bold leading-none text-gray-800"
    : "text-[12px] font-bold uppercase tracking-widest text-gray-500";
  const selectClass = compact
    ? "h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-[14px] font-semibold text-gray-900 outline-none transition-colors focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
    : "h-12 w-full rounded-2xl border border-gray-300 bg-white px-4 text-[14px] font-semibold text-gray-900 outline-none transition-colors focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10";

  return (
    <div className={`flex flex-col ${compact ? "gap-1.5" : "gap-3"}`}>
      <label className={labelClass}>Готовая популярная позиция</label>
      <select
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value || null)}
        className={selectClass}
      >
        <option value="">Выберите из 40 позиций</option>
        {CALCULATOR_PRESET_GROUPS.map((group) => (
          <optgroup key={group.key} label={group.label}>
            {group.items.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.title}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      {currentPreset && (
        <p className={`${compact ? "text-[11px]" : "text-[12px]"} text-gray-500 leading-relaxed`}>
          Справочный вес: <span className="font-semibold text-gray-700">{currentPreset.weightDisplay}</span>
        </p>
      )}
    </div>
  );
};
