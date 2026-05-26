import path from "path";
import fs from "fs";
import { products as staticProducts, type Product } from "@/data/catalog";
import { blogPosts as staticBlogPosts, type BlogPost } from "@/data/blog";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJson<T>(file: string, fallback: T): T {
  ensureDir();
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, JSON.stringify(fallback, null, 2));
    return fallback;
  }
  return JSON.parse(fs.readFileSync(p, "utf-8")) as T;
}

function writeJson(file: string, data: unknown) {
  ensureDir();
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

// ── Products ──────────────────────────────────────────────
export function getProducts(): Product[] {
  return readJson("products.json", staticProducts);
}
export function saveProducts(data: Product[]) {
  writeJson("products.json", data);
}

// ── Blog ─────────────────────────────────────────────────
export function getBlogPosts(): BlogPost[] {
  return readJson("blog-posts.json", staticBlogPosts);
}
export function saveBlogPosts(data: BlogPost[]) {
  writeJson("blog-posts.json", data);
}

// ── Orders ───────────────────────────────────────────────
export interface Order {
  id: string;
  name: string;
  phone: string;
  comment: string;
  product?: string;
  status: "new" | "inwork" | "done" | "cancelled";
  createdAt: string;
}

export function getOrders(): Order[] {
  return readJson("orders.json", []);
}
export function saveOrders(data: Order[]) {
  writeJson("orders.json", data);
}
