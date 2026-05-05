import { cookies } from "next/headers";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import LogoutButton from "../ui/LogoutButton";

export default async function WelcomePage() {
  const session = getSession(cookies());
  if (!session) {
    return (
      <main className="shell">
        <section className="card">
          <header className="card__header">
            <div className="brand">
              <div className="brand__mark" aria-hidden="true">
                BT
              </div>
              <div>
                <h1 className="brand__title">Welcome</h1>
                <p className="brand__subtitle">Please sign in</p>
              </div>
            </div>
          </header>
          <Link className="btn btn--primary" href="/" style={{ display: "flex", justifyContent: "center", textDecoration: "none" }}>
            Go to login
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="shell">
      <section className="card">
        <header className="card__header">
          <div className="brand">
            <div className="brand__mark" aria-hidden="true">
              BT
            </div>
            <div>
              <h1 className="brand__title">WELCOME, {session.name.toUpperCase()}!</h1>
              <p className="brand__subtitle">You are signed in</p>
            </div>
          </div>
        </header>
        <div className="form">
          {session.role === "admin" ? (
            <Link className="btn btn--primary" href="/dashboard" style={{ display: "flex", justifyContent: "center", textDecoration: "none" }}>
              Go to dashboard
            </Link>
          ) : null}
          <LogoutButton />
        </div>
      </section>
    </main>
  );
}
