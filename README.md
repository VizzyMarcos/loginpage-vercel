# Login system (Vercel-ready)

Next.js (App Router) login/register with:

- Postgres database (`DATABASE_URL`)
- Cookie-based sessions (JWT) (`AUTH_SECRET`)
- Admin dashboard to view/delete registered users
- Welcome page after login

## 1) Create a Postgres database

Use any hosted Postgres:

- Vercel Postgres
- Neon
- Supabase

Run the SQL in `db/schema.sql` on your database.

## 2) Configure environment variables

Create `.env.local`:

- `DATABASE_URL=...`
- `AUTH_SECRET=...` (long random string)

## 3) Run locally

```bash
npm install
npm run dev
```

Open:

- `http://localhost:3000/`

## 4) Create the first admin

Open:

- `http://localhost:3000/setup`

After an admin exists, `/setup` will redirect back to login.

## Routes

- `/` login
- `/register` create account
- `/welcome` welcome page after login
- `/dashboard` admin-only users list

## Deploy to Vercel

1) Push this folder to GitHub
2) Import the repo in Vercel
3) Add env vars in Vercel Project Settings:
   - `DATABASE_URL`
   - `AUTH_SECRET`
4) Deploy

