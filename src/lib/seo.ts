import type { Metadata } from "next";
import { BRAND_COLORS, CONTACTS } from "@/lib/constants";
import { getProductImage } from "@/lib/productImages";
import type { BlogPost } from "@/data/blog";
import type { Product } from "@/data/catalog";

export const SITE_NAME = "Ростехсталь";
export const DEFAULT_OG_IMAGE = "/images/hero/hero-metal-yard.jpg";

const LOCAL_SITE_URL = "http://localhost:3000";
const COMMON_KEYWORDS = [
  "металлопрокат Бишкек",
  "металлобаза в Бишкеке",
  "металлопрокат Кыргызстан",
  "доставка металлопроката по Кыргызстану",
  "поставка металлопроката по регионам",
  "арматура Бишкек",
  "профильная труба Бишкек",
  "листовой прокат Бишкек",
  "швеллер Бишкек",
  "резка металла Бишкек",
];

export function getSiteUrl() {
  // 1) Explicit canonical domain (set this once a real domain is purchased).
  // 2) Vercel's auto-provided production hostname (stable per project, no protocol).
  // 3) Localhost fallback for local dev.
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelHost =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();

  const rawUrl = explicit || (vercelHost ? `https://${vercelHost}` : "");

  if (!rawUrl) return LOCAL_SITE_URL;

  try {
    const url = new URL(rawUrl);
    return `${url.origin}${url.pathname.replace(/\/$/, "")}`;
  } catch {
    return LOCAL_SITE_URL;
  }
}

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export function truncateMeta(value: string, maxLength = 155) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trim()}…`;
}

export function buildMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  keywords = [],
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
}): Metadata {
  const canonical = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    keywords: [...keywords, ...COMMON_KEYWORDS],
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "ru_RU",
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — металлопрокат в Бишкеке`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function jsonLdGraph(nodes: Array<Record<string, unknown>>) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

export function organizationJsonLd() {
  const siteUrl = getSiteUrl();
  const logo = absoluteUrl("/images/logo.png");

  return jsonLdGraph([
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: SITE_NAME,
      url: siteUrl,
      logo,
      image: logo,
      email: CONTACTS.email,
      telephone: CONTACTS.phoneRaw,
      sameAs: ["https://t.me/rostehstal", "https://www.instagram.com/rostehstal.kg/"],
    },
    {
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#localbusiness`,
      name: SITE_NAME,
      url: siteUrl,
      image: absoluteUrl(DEFAULT_OG_IMAGE),
      logo,
      telephone: CONTACTS.phoneRaw,
      email: CONTACTS.email,
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        streetAddress: 'пр. Манаса 41А, БЦ "Адмирал", офис 18В',
        addressLocality: "Бишкек",
        addressCountry: "KG",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 42.8746,
        longitude: 74.5898,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: "10:00",
          closes: "16:00",
        },
      ],
      areaServed: [
        { "@type": "City", name: "Бишкек" },
        { "@type": "Country", name: "Кыргызстан" },
      ],
      makesOffer: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Поставка металлопроката" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Резка металла" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Доставка металлопроката по Кыргызстану" } },
      ],
    },
  ]);
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function parsePriceValue(price?: string) {
  if (!price) return undefined;
  const digits = price.replace(/[^\d]/g, "");
  if (!digits) return undefined;
  const value = Number(digits);
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

export function productJsonLd(product: Product) {
  const url = absoluteUrl(`/catalog/${product.slug}`);
  const priceValue = parsePriceValue(product.price);

  return {
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: truncateMeta(product.desc ?? `${product.name} в каталоге Ростехсталь.`, 500),
    image: absoluteUrl(getProductImage(product)),
    url,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    additionalProperty: product.specs?.map((spec) => ({
      "@type": "PropertyValue",
      name: spec.label,
      value: spec.value,
    })),
    // Only emit an Offer when there's a real price — an Offer без цены
    // triggers Google rich-result warnings.
    ...(priceValue
      ? {
          offers: {
            "@type": "Offer",
            url,
            priceCurrency: "KGS",
            price: priceValue,
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
            seller: { "@id": `${getSiteUrl()}/#organization` },
          },
        }
      : {}),
  };
}

export function articleJsonLd(post: BlogPost) {
  return {
    "@type": "Article",
    "@id": `${absoluteUrl(`/blog/${post.slug}`)}#article`,
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    headline: post.title,
    description: truncateMeta(post.excerpt, 500),
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    publisher: {
      "@id": `${getSiteUrl()}/#organization`,
    },
  };
}

export function faqPageJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function productMetaDescription(product: Product) {
  const base = product.desc ?? `${product.name} в каталоге Ростехсталь.`;
  return truncateMeta(`${base} Поставка со склада в Бишкеке, резка и доставка по Кыргызстану.`);
}

export function categoryMetaDescription(category: string) {
  return truncateMeta(
    `${category}: поставка металлопроката со склада в Бишкеке, резка и доставка по Кыргызстану для строительных компаний.`
  );
}

export function pageAccentColor() {
  return BRAND_COLORS.primary;
}
