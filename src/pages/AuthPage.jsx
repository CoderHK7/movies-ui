import { useState } from "react";
import { setToken } from "../auth/token";
import { useNavigate, Link } from "react-router-dom";

export default function AuthPage() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

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
        // Your backend returns accessToken
        const token = data?.accessToken;
        if (!token) throw new Error("Login succeeded but accessToken not found in response.");
        setToken(token);
        navigate("/");
      } else {
        setMsg("Registered successfully. Now switch to Login.");
      }
    } catch (err) {
      setMsg(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#fff", padding: 18 }}>
      <div style={{ maxWidth: 520, margin: "0 auto", fontFamily: "system-ui, Arial" }}>
        <Link to="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>
          ← Back
        </Link>

        <div style={{ height: 18 }} />

        <h1 style={{ margin: 0 }}>{mode === "login" ? "Login" : "Register"}</h1>
        <div style={{ marginTop: 8, color: "rgba(255,255,255,0.7)" }}>
          {mode === "login"
            ? "Login to post reviews."
            : "Create an account to start reviewing movies."}
        </div>

        <div style={{ height: 16 }} />

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => setMode("login")}
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.16)",
              cursor: "pointer",
              background: mode === "login" ? "#fff" : "transparent",
              color: mode === "login" ? "#000" : "#fff",
              fontWeight: 800,
            }}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.16)",
              cursor: "pointer",
              background: mode === "register" ? "#fff" : "transparent",
              color: mode === "register" ? "#000" : "#fff",
              fontWeight: 800,
            }}
          >
            Register
          </button>
        </div>

        <div style={{ height: 16 }} />

        <form
          onSubmit={submit}
          style={{
            background: "#0b0b0b",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: 16,
          }}
        >
          <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              marginTop: 6,
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "#050505",
              color: "#fff",
              outline: "none",
            }}
          />

          <div style={{ height: 12 }} />

          <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              marginTop: 6,
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "#050505",
              color: "#fff",
              outline: "none",
            }}
          />

          <div style={{ height: 16 }} />

          <button
            disabled={loading}
            type="submit"
            style={{
              width: "100%",
              background: "#fff",
              color: "#000",
              border: 0,
              padding: "10px 12px",
              borderRadius: 14,
              fontWeight: 900,
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
          </button>

          {msg && (
            <div style={{ marginTop: 12, color: msg.includes("success") ? "#8fff8f" : "salmon" }}>
              {msg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
