"use client";

import { useState } from "react";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNotice(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setNotice({ kind: "error", msg: data.error || "Registration failed." });
        return;
      }
      setNotice({ kind: "ok", msg: "Account created. You can sign in now." });
      setTimeout(() => {
        window.location.href = "/";
      }, 650);
    } catch {
      setNotice({ kind: "error", msg: "Network error." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="field">
        <label className="field__label" htmlFor="name">
          Full name
        </label>
        <input
          className="field__input"
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="email">
          Email
        </label>
        <input
          className="field__input"
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="user@btconnect.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="password">
          Password
        </label>
        <input
          className="field__input"
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button className="btn btn--primary" type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create account"}
      </button>

      {notice ? (
        <div className="notice" data-kind={notice.kind} role="status">
          {notice.msg}{" "}
          <a className="link" href="/">
            Sign in
          </a>
        </div>
      ) : null}

      <p className="fineprint">
        Already have an account?{" "}
        <a className="link" href="/">
          Sign in
        </a>
      </p>
    </form>
  );
}