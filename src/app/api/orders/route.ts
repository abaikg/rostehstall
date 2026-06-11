import { NextRequest, NextResponse } from "next/server";
import { getOrders, saveOrders, type Order } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const orders = getOrders();
  const order: Order = {
    id: Date.now().toString(),
    name: body.name || "",
    phone: body.phone || "",
    email: body.email || "",
    comment: body.comment || "",
    product: body.product || "",
    status: "new",
    createdAt: new Date().toISOString(),
  };
  orders.unshift(order);
  saveOrders(orders);
  return NextResponse.json({ ok: true });
}
