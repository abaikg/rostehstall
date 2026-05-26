import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, recordFailedAttempt, clearAttempts, verifyUsername, verifyPassword, createSessionToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  // IP для rate limiting
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? req.headers.get("x-real-ip") ?? "unknown";

  // Проверяем rate limit
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Слишком много попыток. Попробуйте через ${Math.ceil((rl.retryAfter ?? 900) / 60)} мин.` },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  const { username, password } = await req.json();

  if (!verifyUsername(username) || !verifyPassword(password)) {
    recordFailedAttempt(ip);
    // Добавляем задержку чтобы усложнить перебор
    await new Promise((r) => setTimeout(r, 500));
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }

  // Успешный вход — сбрасываем счётчик и выдаём токен
  clearAttempts(ip);
  const token = createSessionToken();

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 дней
  });
  return res;
}
