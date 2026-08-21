import { createHmac, timingSafeEqual } from "crypto";

export const SESSION_COOKIE = "ss_admin";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function getAdminEmail(): string {
  return (process.env.ADMIN_EMAIL ?? "joaquin@safesound.com").toLowerCase();
}

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "joaquin123";
}

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? "safesound-dev-secret-change-me";
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function verifyCredentials(email: unknown, password: unknown): boolean {
  if (typeof email !== "string" || typeof password !== "string") return false;
  return (
    email.trim().toLowerCase() === getAdminEmail() &&
    password === getAdminPassword()
  );
}

export function createSessionToken(): string {
  const payload = Buffer.from(
    `${getAdminEmail()}|${Date.now() + SESSION_TTL_MS}`,
    "utf8"
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function isHttpsRequest(request: Request): boolean {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (forwardedProto) {
    return forwardedProto.split(",")[0].trim() === "https";
  }
  try {
    return new URL(request.url).protocol === "https:";
  } catch {
    return false;
  }
}

export function isValidSessionToken(token: unknown): boolean {
  if (typeof token !== "string") return false;
  const dotIndex = token.lastIndexOf(".");
  if (dotIndex <= 0) return false;

  const payload = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);

  const expected = sign(payload);
  const expectedBuffer = Buffer.from(expected, "utf8");
  const signatureBuffer = Buffer.from(signature, "utf8");
  if (expectedBuffer.length !== signatureBuffer.length) return false;
  if (!timingSafeEqual(expectedBuffer, signatureBuffer)) return false;

  try {
    const decoded = Buffer.from(payload, "base64url").toString("utf8");
    const separatorIndex = decoded.lastIndexOf("|");
    if (separatorIndex <= 0) return false;

    const expires = Number(decoded.slice(separatorIndex + 1));
    return Number.isFinite(expires) && Date.now() < expires;
  } catch {
    return false;
  }
}
