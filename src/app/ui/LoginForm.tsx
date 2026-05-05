"use client";

import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNotice(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setNotice({ kind: "error", msg: data.error || "Login failed." });
        return;
      }
      window.location.href = "/welcome";
    } catch {
      setNotice({ kind: "error", msg: "Network error." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="field">
        <label className="field__label" htmlFor="email">
          Email or username
        </label>
        <input
          className="field__input"
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="password">
          Password
        </label>
        <div className="password">
          <input
            className="field__input password__input"
            id="password"
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="password__toggle" type="button" onClick={() => setShow((s) => !s)} aria-label="Show password">
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <div className="row row--space">
        <a className="link" href="#" onClick={(e) => (e.preventDefault(), alert("Please contact the site admin."))}>
          Forgot log-in details?
        </a>
        <a className="link" href="/register">
          Create account
        </a>
      </div>

      <button className="btn btn--primary" type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Log in"}
      </button>

      {notice ? (
        <div className="notice" data-kind={notice.kind} role="status">
          {notice.msg}
        </div>
      ) : null}
    </form>
  );
}

