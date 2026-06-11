import { Product } from "@/data/catalog";

export const getProductImage = (product: Product) => {
  if (product.image) return product.image;

  const haystack = `${product.slug} ${product.category} ${product.imgQuery} ${product.name}`.toLowerCase();

  if (haystack.includes("asbest") || haystack.includes("hrizotil") || haystack.includes("cement")) {
    return "/images/products/cement-pipes.png";
  }

  if (haystack.includes("alumin")) {
    return "/images/products/aluminum-profiles.png";
  }

  if (haystack.includes("armatura") || haystack.includes("rebar")) {
    return "/images/rebar.png";
  }

  if (haystack.includes("list") || haystack.includes("sheet") || haystack.includes("plate")) {
    return "/images/steel-sheet.png";
  }

  if (
    haystack.includes("ugolok") ||
    haystack.includes("shveller") ||
    haystack.includes("angle") ||
    haystack.includes("channel") ||
    haystack.includes("beam") ||
    haystack.includes("structural")
  ) {
    return "/images/products/structural-profiles.png";
  }

  if (haystack.includes("profil") || haystack.includes("square") || haystack.includes("rectangular")) {
    return "/images/profile-pipes.png";
  }

  return "/images/seamless-pipes.png";
};
