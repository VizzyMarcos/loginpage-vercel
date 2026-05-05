import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clearSessionCookie } from "@/lib/auth";

export async function POST() {
  const jar = cookies();
  clearSessionCookie(jar);
  return NextResponse.json({ ok: true });
}
