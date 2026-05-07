"use client";

import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: false, password: false });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors = { email: !email.trim(), password: !password.trim() };
    setErrors(newErrors);
    if (newErrors.email || newErrors.password) return;

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
    <div style={styles.page}>
      <div style={styles.glowLine} />

      <div style={styles.card}>
        {/* BT Logo */}
        <div style={styles.logoWrapper}>
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="26" stroke="#5514B4" strokeWidth="3" fill="white" />
            <text x="28" y="35" textAnchor="middle" fontSize="16" fontWeight="bold" fontFamily="Arial, sans-serif" fill="#5514B4">BT</text>
          </svg>
        </div>

        <h1 style={styles.heading}>Log in</h1>

        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column" }}>
          {/* Email */}
          <label style={styles.label} htmlFor="email">Email or username</label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (e.target.value.trim()) setErrors((p) => ({ ...p, email: false })); }}
            style={{ ...styles.input, borderColor: errors.email ? "#c00" : "#333" }}
          />
          {errors.email && (
            <div style={styles.errorBox}>
              <span style={styles.errorArrow}>▲</span>
              Please enter your email or username
            </div>
          )}

          {/* Password */}
          <label style={{ ...styles.label, marginTop: "18px" }} htmlFor="password">Password</label>
          <div style={styles.passwordWrapper}>
            <input
              id="password"
              name="password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              minLength={6}
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (e.target.value.trim()) setErrors((p) => ({ ...p, password: false })); }}
              style={{ ...styles.input, borderColor: errors.password ? "#c00" : "#333", marginBottom: 0, flex: 1 }}
            />
            <button type="button" onClick={() => setShow((s) => !s)} style={styles.showBtn}>
              {show ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && (
            <div style={styles.errorBox}>
              <span style={styles.errorArrow}>▲</span>
              Please enter your password
            </div>
          )}

          {/* Links */}
          <div style={styles.linkRow}>
            <a style={styles.link} href="#" onClick={(e) => (e.preventDefault(), alert("Please contact the site admin."))}>
              Forgot log-in details?
            </a>
            <a style={styles.link} href="/register">Create account</a>
          </div>

          {/* Error/Success Notice */}
          {notice && (
            <div style={{ ...styles.errorBox, background: notice.kind === "ok" ? "#1a7a1a" : "#c00", marginBottom: "8px" }}>
              {notice.msg}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading} style={{ ...styles.loginBtn, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    width: "100vw",
    position: "fixed",
    top: 0,
    left: 0,
    background: "linear-gradient(135deg, #3a007a 0%, #6a0dad 40%, #9b30e8 70%, #c084fc 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: "8vw",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    overflow: "hidden",
  },
  glowLine: {
    position: "absolute",
    top: "-10%",
    right: "15%",
    width: "4px",
    height: "130%",
    background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.6), rgba(255,255,255,0.9), rgba(200,150,255,0.4), transparent)",
    transform: "rotate(20deg)",
    borderRadius: "4px",
    boxShadow: "0 0 40px 12px rgba(255,255,255,0.25)",
    pointerEvents: "none",
  },
  card: {
    background: "#fff",
    borderRadius: "4px",
    padding: "40px 40px 48px",
    width: "100%",
    maxWidth: "390px",
    boxShadow: "0 4px 32px rgba(0,0,0,0.18)",
    display: "flex",
    flexDirection: "column",
    zIndex: 1,
    position: "relative",
  },
  logoWrapper: { marginBottom: "24px" },
  heading: { fontSize: "28px", fontWeight: "700", color: "#1a1a1a", margin: "0 0 20px 0" },
  label: { fontSize: "14px", color: "#1a1a1a", marginBottom: "6px", display: "block" },
  input: {
    width: "100%",
    padding: "12px 14px",
    fontSize: "15px",
    border: "2px solid #333",
    borderRadius: "2px",
    outline: "none",
    boxSizing: "border-box",
    color: "#000",
    backgroundColor: "#fff",
  },
  passwordWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  showBtn: {
    padding: "12px 14px",
    background: "transparent",
    border: "2px solid #333",
    borderRadius: "2px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#5514B4",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  errorBox: {
    background: "#c00",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    padding: "10px 14px",
    borderRadius: "2px",
    marginTop: "4px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  errorArrow: { fontSize: "10px", color: "#fff", marginTop: "-14px", alignSelf: "flex-start" },
  linkRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "14px",
    marginBottom: "4px",
  },
  link: { color: "#5514B4", fontSize: "14px", textDecoration: "underline", cursor: "pointer" },
  loginBtn: {
    marginTop: "16px",
    width: "100%",
    padding: "14px",
    background: "#5514B4",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    border: "none",
    borderRadius: "2px",
    cursor: "pointer",
    letterSpacing: "0.3px",
  },
};