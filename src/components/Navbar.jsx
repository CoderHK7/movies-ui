import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearToken, getToken } from "../auth/token";
import { useEffect, useMemo, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = !!getToken();

  const [menuOpen, setMenuOpen] = useState(false);
  const [term, setTerm] = useState("");

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const q = (url.searchParams.get("q") || "").trim();
    if (location.pathname === "/search") setTerm(q);
    if (location.pathname !== "/search") setTerm("");
  }, [location.pathname]);

  function logout() {
    clearToken();
    navigate("/");
  }

  const linkStyle = useMemo(
    () => (active) => ({
      textDecoration: "none",
      padding: "10px 12px",
      borderRadius: 12,
      fontWeight: 800,
      border: "1px solid rgba(255,255,255,0.10)",
      background: active ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.03)",
      color: active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.78)",
    }),
    []
  );

  function onSubmit(e) {
    e.preventDefault();
    const q = term.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "rgba(5,5,5,0.85)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "10px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
          }}
        >
          {/* Left: Menu + Brand + Search */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
            <button
              onClick={() => setMenuOpen(true)}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.85)",
                padding: "5px 9px",
                borderRadius: 10,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              ☰ Menu
            </button>

            <Link
              to="/"
              style={{
                textDecoration: "none",
                fontWeight: 900,
                fontSize: 18,
                letterSpacing: -0.4,
                color: "#f5c518",
              }}
            >
              Movies UI
            </Link>

            {/* 🔍 Search bar (reduced height) */}
            <form
              onSubmit={onSubmit}
              style={{
                flex: 1,
                maxWidth: 420,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 8px",   // ↓ reduced
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 900, fontSize: 13 }}>
                  ⌕
                </span>

                <input
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="Search movies..."
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: "rgba(255,255,255,0.92)",
                    fontWeight: 600,
                    fontSize: 13,     // ↓ smaller
                  }}
                />

                <button
                  type="submit"
                  style={{
                    border: "none",
                    background: "rgba(255,255,255,0.10)",
                    color: "rgba(255,255,255,0.9)",
                    padding: "4px 8px",   // ↓ smaller
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: 800,
                    fontSize: 12,        // ↓ smaller
                  }}
                >
                  Go
                </button>
              </div>
            </form>
          </div>

          {/* Right: Auth + My Reviews */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {loggedIn ? (
              <>
                <Link to="/my-reviews" style={linkStyle(location.pathname === "/my-reviews")}>
                  My Reviews
                </Link>

                <button
                  onClick={logout}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.16)",
                    color: "#fff",
                    padding: "10px 12px",
                    borderRadius: 12,
                    cursor: "pointer",
                    fontWeight: 800,
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                style={{
                  textDecoration: "none",
                  background: "#fff",
                  color: "#000",
                  padding: "10px 12px",
                  borderRadius: 12,
                  fontWeight: 900,
                }}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Side menu overlay (unchanged) */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 20,
            background: "rgba(0,0,0,0.55)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 320,
              height: "100%",
              background: "rgba(11,11,11,0.92)",
              borderRight: "1px solid rgba(255,255,255,0.10)",
              padding: 16,
            }}
          >
            <div style={{ display: "grid", gap: 10 }}>
              <Link to="/" style={linkStyle(location.pathname === "/")}>Home</Link>
              <Link to="/top-rated" style={linkStyle(location.pathname === "/top-rated")}>Top Rated</Link>
              <Link to="/latest" style={linkStyle(location.pathname === "/latest")}>Latest</Link>
              <Link to="/search" style={linkStyle(location.pathname === "/search")}>Search</Link>

              {loggedIn ? (
                <Link to="/my-reviews" style={linkStyle(location.pathname === "/my-reviews")}>
                  My Reviews
                </Link>
              ) : (
                <Link to="/auth" style={linkStyle(location.pathname === "/auth")}>
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
