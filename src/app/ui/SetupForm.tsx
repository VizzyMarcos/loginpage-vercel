"use client";

import { useState } from "react";

export default function SetupForm() {
  const [name, setName] = useState("");
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
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setNotice({ kind: "error", msg: data.error || "Setup failed." });
        return;
      }
      setNotice({ kind: "ok", msg: "Admin created. You can sign in now." });
      setTimeout(() => (window.location.href = "/"), 650);
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
        <input className="field__input" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="email">
          Email
        </label>
        <input
          className="field__input"
          id="email"
          type="email"
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
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          <button className="password__toggle" type="button" onClick={() => setShow((s) => !s)}>
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <button className="btn btn--primary" type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create admin"}
      </button>

      {notice ? (
        <div className="notice" data-kind={notice.kind} role="status">
          {notice.msg}
        </div>
      ) : null}
    </form>
  );
}

