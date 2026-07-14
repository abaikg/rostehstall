import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/db";
import type { Product } from "@/data/catalog";

// Подкатегории существуют только как поле товаров — все операции каскадные.

function applySubcategory(p: Product, oldName: string, newName: string) {
  p.subcategory = newName;
  p.tags = (p.tags ?? []).map((t) => (t === oldName ? newName : t));
  if (p.tags.length === 0) p.tags = [newName];
  p.specs = (p.specs ?? []).map((s) =>
    s.label === "Подкатегория" ? { ...s, value: newName } : s
  );
}

// Переименование и/или перенос подкатегории в другую категорию
export async function PUT(req: NextRequest) {
  const { oldName, newName, moveToCategory } = await req.json();
  if (!oldName) return NextResponse.json({ error: "Укажите подкатегорию" }, { status: 400 });

  const renamed = String(newName ?? "").trim();
  const products = getProducts();
  let touched = 0;

  for (const p of products) {
    if (p.subcategory !== oldName) continue;
    if (renamed && renamed !== oldName) applySubcategory(p, oldName, renamed);
    if (moveToCategory) p.category = String(moveToCategory);
    touched++;
  }

  if (touched === 0) return NextResponse.json({ error: "Подкатегория не найдена" }, { status: 404 });
  saveProducts(products);
  return NextResponse.json({ ok: true, touched });
}

// Удаление подкатегории вместе с товарами
export async function DELETE(req: NextRequest) {
  const { name } = await req.json();
  if (!name) return NextResponse.json({ error: "Укажите подкатегорию" }, { status: 400 });

  const products = getProducts();
  const rest = products.filter((p) => p.subcategory !== name);
  const removed = products.length - rest.length;
  if (removed === 0) return NextResponse.json({ error: "Подкатегория не найдена" }, { status: 404 });

  saveProducts(rest);
  return NextResponse.json({ ok: true, removed });
}
