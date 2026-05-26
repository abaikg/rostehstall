import { NextRequest, NextResponse } from "next/server";
import { getBlogPosts, saveBlogPosts } from "@/lib/db";
import type { BlogPost } from "@/data/blog";

export async function GET() {
  return NextResponse.json(getBlogPosts());
}

export async function POST(req: NextRequest) {
  const body: BlogPost = await req.json();
  const posts = getBlogPosts();
  const maxId = posts.reduce((m, p) => Math.max(m, p.id), 0);
  const newPost = { ...body, id: maxId + 1 };
  posts.push(newPost);
  saveBlogPosts(posts);
  return NextResponse.json(newPost, { status: 201 });
}
