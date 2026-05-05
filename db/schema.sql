-- PostgreSQL schema
-- Create the table in your hosted Postgres (Neon/Supabase/Vercel Postgres).

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin','user')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Optional: create your first admin user by inserting with role='admin'
-- (or use the /setup route we provide in-app).

