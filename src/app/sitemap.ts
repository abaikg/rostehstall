import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";
import { getCategoryPath, getIndexedCategories } from "@/lib/catalogRoutes";
import { getProducts } from "@/lib/db";
import { absoluteUrl } from "@/lib/seo";
import { getProductImage } from "@/lib/productImages";

const buildDate = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const products = getProducts();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: buildDate, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/catalog"), lastModified: buildDate, changeFrequency: "daily", priority: 0.95 },
    { url: absoluteUrl("/price"), lastModified: buildDate, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/services"), lastModified: buildDate, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/calculator"), lastModified: buildDate, changeFrequency: "monthly", priority: 0.75 },
    { url: absoluteUrl("/blog"), lastModified: buildDate, changeFrequency: "weekly", priority: 0.75 },
    { url: absoluteUrl("/contacts"), lastModified: buildDate, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/about"), lastModified: buildDate, changeFrequency: "monthly", priority: 0.65 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = getIndexedCategories(products).map((category) => ({
    url: absoluteUrl(getCategoryPath(category.name)),
    lastModified: buildDate,
    changeFrequency: "weekly",
    priority: category.productCount > 0 ? 0.8 : 0.35,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: absoluteUrl(`/catalog/${product.slug}`),
    lastModified: buildDate,
    changeFrequency: "weekly",
    priority: 0.85,
    images: [absoluteUrl(getProductImage(product))],
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
}
