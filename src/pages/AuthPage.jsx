import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setToken } from "../auth/token";

export default function AuthPage() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const title = useMemo(() => (mode === "login" ? "Welcome back" : "Create your account"), [mode]);
  const subtitle = useMemo(
    () =>
      mode === "login"
        ? "Login to rate and review movies."
        : "Register to start rating and reviewing movies.",
    [mode]
  );

  async function submit(e) {
    e.preventDefault();

    setLoading(true);
    setMsg("");

    try {
      const endpoint = mode === "login" ? "/api/v1/auth/login" : "/api/v1/auth/register";

      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const serverMsg = data?.message || data?.error || `${res.status} ${res.statusText}`;
        throw new Error(serverMsg);
      }

      if (mode === "login") {
        const token = data?.accessToken;
        if (!token) throw new Error("Login succeeded but accessToken not found in response.");
        setToken(token);
        navigate("/");
      } else {
        setMsg("Registered successfully. Switch to Login to continue.");
        setMode("login");
      }
    } catch (err) {
      setMsg(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const tabBtn = (active) => ({
    flex: 1,
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: active ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
    color: active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.7)",
    fontWeight: 800,
    letterSpacing: 0.2,
    cursor: "pointer",
  });

  const inputStyle = {
    width: "100%",
    marginTop: 6,
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.95)",
    outline: "none",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(900px 500px at 20% 10%, rgba(245,197,24,0.14), transparent 60%), radial-gradient(900px 500px at 80% 30%, rgba(255,255,255,0.06), transparent 60%), #050505",
        color: "#fff",
        padding: 18,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 520, margin: "0 auto" }}>
        <Link to="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontWeight: 700 }}>
          ← Back
        </Link>

        <div style={{ height: 16 }} />

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(11,11,11,0.78)",
            backdropFilter: "blur(10px)",
            borderRadius: 18,
            padding: 18,
            boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div>
              <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.4 }}>{title}</div>
              <div style={{ marginTop: 6, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{subtitle}</div>
            </div>

            <div
              style={{
                padding: "8px 10px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.03)",
                color: "rgba(255,255,255,0.8)",
                fontWeight: 900,
                letterSpacing: 0.3,
                whiteSpace: "nowrap",
              }}
            >
              Movies UI
            </div>
          </div>

          <div style={{ height: 14 }} />

          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" onClick={() => setMode("login")} style={tabBtn(mode === "login")}>
              Login
            </button>
            <button type="button" onClick={() => setMode("register")} style={tabBtn(mode === "register")}>
              Register
            </button>
          </div>

          <div style={{ height: 14 }} />

          <form
            onSubmit={submit}
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              borderRadius: 16,
              padding: 16,
            }}
          >
            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 800 }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 800 }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: "#f5c518",
                  color: "#000",
                  border: "none",
                  padding: "12px 14px",
                  borderRadius: 14,
                  fontWeight: 900,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.25)",
                }}
              >
                {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
              </button>

              {msg ? (
                <div
                  style={{
                    borderRadius: 12,
                    padding: "10px 12px",
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(0,0,0,0.35)",
                    color: msg.toLowerCase().includes("success") ? "#8fff8f" : "salmon",
                    fontWeight: 700,
                  }}
                >
                  {msg}
                </div>
              ) : null}
            </div>
          </form>

          <div style={{ height: 10 }} />

          <div style={{ color: "rgba(255,255,255,0.55)", fontWeight: 600, fontSize: 12 }}>
            Tip: Password should be at least 6 characters.
          </div>
        </div>
      </div>
    </div>
  );
}
