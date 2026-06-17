import { CATEGORY_LIST, products } from "@/data/catalog";

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

export function getProductsForCategory(category: string) {
  return products.filter((product) => product.category === category || product.tags?.includes(category));
}

export function getIndexedCategories() {
  const productCategories = new Set<string>();

  for (const product of products) {
    productCategories.add(product.category);
    product.tags?.forEach((tag) => productCategories.add(tag));
  }

  const orderedCategories = CATEGORY_LIST.map((category) => category.name);
  const categoryNames = [
    ...orderedCategories,
    ...Array.from(productCategories).filter((name) => !orderedCategories.includes(name)),
  ];

  return categoryNames.map((name) => ({
    name,
    slug: getCategorySlug(name),
    path: getCategoryPath(name),
    productCount: getProductsForCategory(name).length,
  }));
}

export function getCategoryBySlug(slug: string) {
  return getIndexedCategories().find((category) => category.slug === slug);
}
