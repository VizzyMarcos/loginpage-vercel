import bcrypt from "bcryptjs";
import { db } from "./db";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  created_at: string;
};

export async function getUserByEmail(email: string) {
  const client = await db().connect();
  try {
    const res = await client.query(
      "SELECT id::text as id, name, email, password_hash, role, created_at::text as created_at FROM users WHERE email = $1 LIMIT 1",
      [email.toLowerCase().trim()]
    );
    return res.rows[0] as (UserRow & { password_hash: string }) | undefined;
  } finally {
    client.release();
  }
}

export async function createUser(params: { name: string; email: string; password: string; role?: "admin" | "user" }) {
  const name = params.name.trim();
  const email = params.email.toLowerCase().trim();
  const role = params.role ?? "user";
  const password_hash = await bcrypt.hash(params.password, 10);

  const client = await db().connect();
  try {
    const res = await client.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id::text as id, name, email, role, created_at::text as created_at",
      [name, email, password_hash, role]
    );
    return res.rows[0] as UserRow;
  } finally {
    client.release();
  }
}

export async function listRegisteredUsers(q?: string) {
  const client = await db().connect();
  try {
    const needle = (q ?? "").trim().toLowerCase();
    if (!needle) {
      const res = await client.query(
        "SELECT id::text as id, name, email, role, created_at::text as created_at FROM users WHERE role = 'user' ORDER BY created_at DESC, id DESC"
      );
      return res.rows as UserRow[];
    }
    const like = `%${needle}%`;
    const res = await client.query(
      "SELECT id::text as id, name, email, role, created_at::text as created_at FROM users WHERE role = 'user' AND (LOWER(name) LIKE $1 OR LOWER(email) LIKE $1) ORDER BY created_at DESC, id DESC",
      [like]
    );
    return res.rows as UserRow[];
  } finally {
    client.release();
  }
}

export async function deleteUser(userId: string) {
  const client = await db().connect();
  try {
    await client.query("DELETE FROM users WHERE id = $1 AND role = 'user'", [userId]);
  } finally {
    client.release();
  }
}

export async function hasAdmin() {
  const client = await db().connect();
  try {
    const res = await client.query("SELECT 1 FROM users WHERE role = 'admin' LIMIT 1");
    return res.rowCount > 0;
  } finally {
    client.release();
  }
}

