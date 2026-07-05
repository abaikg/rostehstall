import { NextRequest, NextResponse } from "next/server";

// Edge runtime: используем Web Crypto API (нет доступа к Node.js crypto/fs)
async function verifyToken(token: string): Promise<boolean> {
  try {
    // В проде секрет обязан быть задан — без него любой токен невалиден.
    // Fallback только для локальной разработки (согласован с src/lib/auth.ts).
    const secret = process.env.ADMIN_SECRET
      ?? (process.env.NODE_ENV !== "production" ? "dev-only-secret" : undefined);
    if (!secret) return false;
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return false;

    // Проверяем HMAC подпись
    const enc     = new TextEncoder();
    const keyData = enc.encode(secret);
    const key     = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const sigBuf  = Uint8Array.from(sig.match(/.{2}/g)!.map((b) => parseInt(b, 16)));
    const valid   = await crypto.subtle.verify("HMAC", key, sigBuf, enc.encode(payload));
    if (!valid) return false;

    // Проверяем срок действия
    const { exp } = JSON.parse(atob(payload));
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
  // /api/admin/auth — логин, доступен без сессии; всё остальное в /api/admin/* — только с ней
  const isAdminApi = pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/auth");

  if (isAdminPage || isAdminApi) {
    const token = request.cookies.get("admin_session")?.value;

    if (!token || !(await verifyToken(token))) {
      if (isAdminApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const res = NextResponse.redirect(new URL("/admin/login", request.url));
      res.cookies.delete("admin_session");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
