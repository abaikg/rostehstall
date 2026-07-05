import crypto from "crypto";

// В production все секреты обязаны быть заданы через окружение —
// понятная ошибка вместо тихого небезопасного fallback. Проверка ленивая
// (в момент вызова, не при импорте): у `next build` NODE_ENV=production,
// но runtime-секретов при сборке нет и быть не должно.
function requiredEnv(name: string, devFallback: string): string {
  const value = process.env[name];
  if (value) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error(`Переменная окружения ${name} обязательна в production (см. .env.example)`);
  }
  return devFallback;
}

// Fallback-значения согласованы с src/proxy.ts (edge-верификация токена)
const getSecret = () => requiredEnv("ADMIN_SECRET", "dev-only-secret");
const getSalt   = () => requiredEnv("ADMIN_SALT", "dev-only-salt");
const SESSION_TTL = 7 * 24 * 60 * 60 * 1000; // 7 дней

// ── Rate limiting (in-memory, сбрасывается при рестарте) ────────────────────
const MAX_ATTEMPTS = 5;
const LOCK_MS      = 15 * 60 * 1000; // 15 минут

interface Attempt { count: number; lockedUntil?: number }
const _attempts = new Map<string, Attempt>();

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now  = Date.now();
  const rec  = _attempts.get(ip);
  if (rec?.lockedUntil) {
    if (rec.lockedUntil > now) return { allowed: false, retryAfter: Math.ceil((rec.lockedUntil - now) / 1000) };
    _attempts.delete(ip); // блокировка истекла
  }
  return { allowed: true };
}

export function recordFailedAttempt(ip: string) {
  const rec = _attempts.get(ip) ?? { count: 0 };
  rec.count += 1;
  if (rec.count >= MAX_ATTEMPTS) rec.lockedUntil = Date.now() + LOCK_MS;
  _attempts.set(ip, rec);
}

export function clearAttempts(ip: string) {
  _attempts.delete(ip);
}

// ── Проверка пароля (timing-safe) ───────────────────────────────────────────
export function verifyUsername(input: string): boolean {
  const expected = process.env.ADMIN_USERNAME ?? "admin";
  if (input.length !== expected.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(input), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function verifyPassword(input: string): boolean {
  // Хэш введённого пароля
  const inputHash = crypto.createHmac("sha256", getSalt()).update(input).digest();

  // Эталонный хэш: если ADMIN_PASSWORD_HASH задан — используем его,
  // иначе хэшируем ADMIN_PASSWORD на лету
  const stored = process.env.ADMIN_PASSWORD_HASH
    ? Buffer.from(process.env.ADMIN_PASSWORD_HASH, "hex")
    : crypto.createHmac("sha256", getSalt())
        .update(requiredEnv("ADMIN_PASSWORD", "admin123"))
        .digest();

  try {
    return crypto.timingSafeEqual(inputHash, stored);
  } catch {
    return false;
  }
}

// ── Утилита для генерации хэша (запустить один раз в консоли) ───────────────
export function hashPassword(password: string): string {
  return crypto.createHmac("sha256", getSalt()).update(password).digest("hex");
}

// ── HMAC-подписанный токен сессии ───────────────────────────────────────────
export function createSessionToken(): string {
  const payload = btoa(JSON.stringify({ role: "admin", exp: Date.now() + SESSION_TTL }));
  const sig     = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

// ── Верификация токена (только Node.js runtime, НЕ для middleware) ───────────
export function verifySessionToken(token: string): boolean {
  try {
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return false;

    const expected = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))) return false;

    const { exp } = JSON.parse(Buffer.from(payload, "base64").toString());
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}
