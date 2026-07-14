"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Product } from "@/data/catalog";
import { ProductForm } from "../_components/ProductForm";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setProduct)
      .catch(() => setError(true));
  }, [id]);

  if (error) {
    return <div className="py-16 text-center text-slate-400 text-[14px]">Товар не найден</div>;
  }
  if (!product) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-[13px]">
        <svg className="animate-spin mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        Загрузка...
      </div>
    );
  }

  return <ProductForm title={`Товар #${product.id}`} initial={product} />;
}
