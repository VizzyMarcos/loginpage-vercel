import jwt from "jsonwebtoken";
import type { cookies as cookiesFn } from "next/headers";

export type SessionClaims = {
  sub: string;
  email: string;
  role: "admin" | "user";
  name: string;
};

const COOKIE_NAME = "lp_session";

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set.");
  return s;
}

export function signSession(claims: SessionClaims) {
  return jwt.sign(claims, secret(), { algorithm: "HS256", expiresIn: "7d" });
}

export function verifySession(token: string): SessionClaims | null {
  try {
    return jwt.verify(token, secret(), { algorithms: ["HS256"] }) as SessionClaims;
  } catch {
    return null;
  }
}

export function getSession(cookies: ReturnType<typeof cookiesFn>): SessionClaims | null {
  const t = cookies.get(COOKIE_NAME)?.value;
  if (!t) return null;
  return verifySession(t);
}

export function setSessionCookie(cookies: ReturnType<typeof cookiesFn>, token: string) {
  cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearSessionCookie(cookies: ReturnType<typeof cookiesFn>) {
  cookies.set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
}