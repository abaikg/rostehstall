"use client";
import { useCallback, useSyncExternalStore } from "react";
import { CalculationInputs } from "@/lib/metal-calculator/types";

export interface CalcHistoryEntry {
  id: string;
  ts: number;
  title: string;   // «Труба круглая Ø57×3,5 · Ст 3»
  result: string;  // «27,71 кг (L = 6 м)»
  inputs: CalculationInputs;
}

const STORAGE_KEY = "rts_calc_history_v1";
const CHANGE_EVENT = "rts-calc-history-change";
const MAX_ENTRIES = 20;
const EMPTY: CalcHistoryEntry[] = [];

// Кэш снапшота: getSnapshot обязан возвращать стабильную ссылку,
// пока содержимое localStorage не изменилось
let snapshotRaw: string | null = null;
let snapshotParsed: CalcHistoryEntry[] = EMPTY;

const getSnapshot = (): CalcHistoryEntry[] => {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw !== snapshotRaw) {
    snapshotRaw = raw;
    try {
      const parsed = raw ? JSON.parse(raw) : [];
      snapshotParsed = Array.isArray(parsed) ? parsed : EMPTY;
    } catch {
      snapshotParsed = EMPTY;
    }
  }
  return snapshotParsed;
};

const getServerSnapshot = (): CalcHistoryEntry[] => EMPTY;

const subscribe = (onStoreChange: () => void) => {
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange); // синхронизация между вкладками
  return () => {
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
};

const writeStorage = (entries: CalcHistoryEntry[]) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // квота/приватный режим — история просто не сохранится
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

export const useCalcHistory = () => {
  const entries = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addEntry = useCallback((entry: Omit<CalcHistoryEntry, "id" | "ts">) => {
    const next: CalcHistoryEntry[] = [
      { ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, ts: Date.now() },
      ...getSnapshot(),
    ].slice(0, MAX_ENTRIES);
    writeStorage(next);
  }, []);

  const removeEntry = useCallback((id: string) => {
    writeStorage(getSnapshot().filter((entry) => entry.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    writeStorage([]);
  }, []);

  return { entries, addEntry, removeEntry, clearHistory };
};
