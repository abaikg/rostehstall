"use client";
import Script from "next/script";

export function JivoChat() {
  const id = process.env.NEXT_PUBLIC_JIVO_ID;
  if (!id) return null;
  return <Script src={`//code.jivosite.com/widget/${id}`} strategy="lazyOnload" />;
}
