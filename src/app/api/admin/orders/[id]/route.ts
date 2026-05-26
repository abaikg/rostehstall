import { NextRequest, NextResponse } from "next/server";
import { getOrders, saveOrders } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await req.json();
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  orders[idx] = { ...orders[idx], status };
  saveOrders(orders);
  return NextResponse.json(orders[idx]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  saveOrders(getOrders().filter((o) => o.id !== id));
  return NextResponse.json({ ok: true });
}
