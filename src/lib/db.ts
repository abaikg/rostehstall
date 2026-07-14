import path from "path";
import fs from "fs";
import { products as staticProducts, CATEGORY_LIST, type Product } from "@/data/catalog";
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

// ── Categories ───────────────────────────────────────────
export interface Category {
  name: string;
  icon: string;
}

// Файл создаётся при первом чтении из статичного списка — дальше
// категориями управляет админка (data/categories.json).
export function getCategories(): Category[] {
  return readJson("categories.json", CATEGORY_LIST);
}
export function saveCategories(data: Category[]) {
  writeJson("categories.json", data);
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
  email?: string;
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
