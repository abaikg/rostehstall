import { products as staticProducts, type Product } from "@/data/catalog";

const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "yo",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

export function getPublicProductGroup(product: Product) {
  return product.subcategory || product.tags?.[0] || product.category;
}

export function slugifySegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[а-яё]/g, (char) => CYRILLIC_TO_LATIN[char] ?? char)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCategorySlug(category: string) {
  return slugifySegment(category);
}

export function getCategoryPath(category: string) {
  return `/catalog/category/${getCategorySlug(category)}`;
}

export function getProductsForCategory(category: string, products: Product[] = staticProducts) {
  return products.filter((product) => getPublicProductGroup(product) === category);
}

export function getIndexedCategories(products: Product[] = staticProducts) {
  const groups = new Map<string, number>();

  for (const product of products) {
    const name = getPublicProductGroup(product);
    groups.set(name, (groups.get(name) ?? 0) + 1);
  }

  return Array.from(groups.entries()).map(([name, productCount]) => ({
    name,
    slug: getCategorySlug(name),
    path: getCategoryPath(name),
    productCount,
  }));
}

export function getCategoryBySlug(slug: string, products: Product[] = staticProducts) {
  return getIndexedCategories(products).find((category) => category.slug === slug);
}
