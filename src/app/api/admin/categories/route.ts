import { NextRequest, NextResponse } from "next/server";
import { getCategories, saveCategories, getProducts, saveProducts } from "@/lib/db";

// Дерево категорий с подкатегориями и количеством товаров — источник
// для страницы «Категории» и селектов в форме товара.
export async function GET() {
  const categories = getCategories();
  const products = getProducts();

  const tree = categories.map((category) => {
    const inCategory = products.filter((p) => p.category === category.name);
    const subMap = new Map<string, number>();
    for (const p of inCategory) {
      const sub = p.subcategory || "(без подкатегории)";
      subMap.set(sub, (subMap.get(sub) ?? 0) + 1);
    }
    return {
      ...category,
      productCount: inCategory.length,
      subcategories: Array.from(subMap.entries()).map(([name, count]) => ({ name, count })),
    };
  });

  // Категории, встречающиеся в товарах, но отсутствующие в списке
  const known = new Set(categories.map((c) => c.name));
  const orphans = Array.from(new Set(products.map((p) => p.category))).filter((name) => !known.has(name));

  return NextResponse.json({ categories: tree, orphans });
}

// Создание категории
export async function POST(req: NextRequest) {
  const { name, icon } = await req.json();
  const trimmed = String(name ?? "").trim();
  if (!trimmed) return NextResponse.json({ error: "Укажите название" }, { status: 400 });

  const categories = getCategories();
  if (categories.some((c) => c.name === trimmed))
    return NextResponse.json({ error: "Такая категория уже есть" }, { status: 409 });

  categories.push({ name: trimmed, icon: String(icon || "bars") });
  saveCategories(categories);
  return NextResponse.json({ ok: true }, { status: 201 });
}

// Переименование категории (каскадно обновляет товары)
export async function PUT(req: NextRequest) {
  const { oldName, newName, icon } = await req.json();
  const trimmed = String(newName ?? "").trim();
  if (!oldName || !trimmed) return NextResponse.json({ error: "Укажите название" }, { status: 400 });

  const categories = getCategories();
  const idx = categories.findIndex((c) => c.name === oldName);
  if (idx === -1) return NextResponse.json({ error: "Категория не найдена" }, { status: 404 });
  if (trimmed !== oldName && categories.some((c) => c.name === trimmed))
    return NextResponse.json({ error: "Такая категория уже есть" }, { status: 409 });

  categories[idx] = { name: trimmed, icon: String(icon || categories[idx].icon) };
  saveCategories(categories);

  if (trimmed !== oldName) {
    const products = getProducts();
    let touched = 0;
    for (const p of products) {
      if (p.category === oldName) {
        p.category = trimmed;
        touched++;
      }
    }
    if (touched > 0) saveProducts(products);
  }
  return NextResponse.json({ ok: true });
}

// Удаление категории — только пустой, чтобы товары не остались без раздела
export async function DELETE(req: NextRequest) {
  const { name } = await req.json();
  const products = getProducts();
  const count = products.filter((p) => p.category === name).length;
  if (count > 0)
    return NextResponse.json(
      { error: `В категории ${count} товаров — сначала перенесите или удалите их` },
      { status: 409 }
    );

  const categories = getCategories().filter((c) => c.name !== name);
  saveCategories(categories);
  return NextResponse.json({ ok: true });
}
