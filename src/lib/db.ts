import { Pool } from "pg";

let pool: Pool | null = null;

export function db() {
  if (pool) return pool;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set.");
  }
  pool = new Pool({
    connectionString,
    // Many hosted Postgres require SSL. If your provider doesn't, set PGSSLMODE=disable in env.
    ssl: process.env.PGSSLMODE === "disable" ? undefined : { rejectUnauthorized: false },
  });
  return pool;
}

