import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/db";
import type { Product } from "@/data/catalog";

export async function GET() {
  return NextResponse.json(getProducts());
}

export async function POST(req: NextRequest) {
  const body: Product = await req.json();
  const products = getProducts();
  const maxId = products.reduce((m, p) => Math.max(m, p.id), 0);
  const newProduct = { ...body, id: maxId + 1 };
  products.push(newProduct);
  saveProducts(products);
  return NextResponse.json(newProduct, { status: 201 });
}
