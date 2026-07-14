import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/db";
import type { Product } from "@/data/catalog";

export async function GET() {
  return NextResponse.json(getProducts());
}

export async function POST(req: NextRequest) {
  const body: Product = await req.json();
  if (!body.name?.trim()) return NextResponse.json({ error: "Укажите название" }, { status: 400 });

  const products = getProducts();
  const maxId = products.reduce((m, p) => Math.max(m, p.id), 0);

  // Slug должен быть уникальным — при совпадении добавляем суффикс
  let slug = (body.slug || "").trim() || `product-${maxId + 1}`;
  const taken = new Set(products.map((p) => p.slug));
  if (taken.has(slug)) {
    let n = 2;
    while (taken.has(`${slug}-${n}`)) n++;
    slug = `${slug}-${n}`;
  }

  const newProduct = { ...body, slug, id: maxId + 1 };
  products.push(newProduct);
  saveProducts(products);
  return NextResponse.json(newProduct, { status: 201 });
}
