import { NextResponse } from "next/server";
import { createUser, getUserByEmail, hasAdmin } from "@/lib/users";

export async function POST(req: Request) {
  try {
    if (await hasAdmin()) {
      return NextResponse.json({ ok: false, error: "Admin already exists." }, { status: 409 });
    }
    const body = (await req.json()) as { name?: string; email?: string; password?: string };
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    if (!name || !email || !password) {
      return NextResponse.json({ ok: false, error: "Fill out all fields." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ ok: false, error: "Password must be at least 6 characters." }, { status: 400 });
    }
    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ ok: false, error: "That email is already registered." }, { status: 409 });
    }
    await createUser({ name, email, password, role: "admin" });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Server error." }, { status: 500 });
  }
}

