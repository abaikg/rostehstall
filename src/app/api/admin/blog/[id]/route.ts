import { NextRequest, NextResponse } from "next/server";
import { getBlogPosts, saveBlogPosts } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = getBlogPosts().find((p) => p.id === Number(id));
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const posts = getBlogPosts();
  const idx = posts.findIndex((p) => p.id === Number(id));
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  posts[idx] = { ...posts[idx], ...body, id: Number(id) };
  saveBlogPosts(posts);
  return NextResponse.json(posts[idx]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const posts = getBlogPosts().filter((p) => p.id !== Number(id));
  saveBlogPosts(posts);
  return NextResponse.json({ ok: true });
}
