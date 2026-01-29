import { Link, useNavigate } from "react-router-dom";
import { clearToken, getToken } from "../auth/token";

export default function Navbar() {
  const navigate = useNavigate();
  const loggedIn = !!getToken();

  function logout() {
    clearToken();
    navigate("/");
  }

  return (
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
          padding: "12px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "system-ui, Arial",
        }}
      >
        <Link to="/" style={{ textDecoration: "none", color: "#fff", fontWeight: 800 }}>
          Movies UI
        </Link>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {loggedIn ? (
            <button
              onClick={logout}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.16)",
                color: "#fff",
                padding: "8px 12px",
                borderRadius: 12,
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Logout
            </button>
          ) : (
            <Link
              to="/auth"
              style={{
                textDecoration: "none",
                background: "#fff",
                color: "#000",
                padding: "8px 12px",
                borderRadius: 12,
                fontWeight: 800,
              }}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
