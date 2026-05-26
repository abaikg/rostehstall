import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProducts().find((p) => p.id === Number(id));
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const products = getProducts();
  const idx = products.findIndex((p) => p.id === Number(id));
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  products[idx] = { ...products[idx], ...body, id: Number(id) };
  saveProducts(products);
  return NextResponse.json(products[idx]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products = getProducts().filter((p) => p.id !== Number(id));
  saveProducts(products);
  return NextResponse.json({ ok: true });
}
