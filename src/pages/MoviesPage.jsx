import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  return (
    <Link
      to={`/movies/${movie.imdbId}`}
      style={{ textDecoration: "none" }}
    >
      <div
        style={{
          borderRadius: 16,
          overflow: "hidden",
          background: "#0b0b0b",
          color: "#fff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          border: "1px solid rgba(255,255,255,0.08)",
          transition: "transform 120ms ease",
        }}
      >
        <div style={{ width: "100%", aspectRatio: "2 / 3", background: "#111" }}>
          {movie.poster ? (
            <img
              src={movie.poster}
              alt={movie.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <div style={{ padding: 12, color: "rgba(255,255,255,0.6)" }}>No poster</div>
          )}
        </div>

        <div style={{ padding: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>
            {movie.title}
          </div>

          <div style={{ marginTop: 6, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
            {movie.imdbId}
          </div>

          <div style={{ marginTop: 10, fontSize: 12, display: "flex", gap: 10 }}>
            <span style={{ color: "rgba(255,255,255,0.85)" }}>
              ⭐ {movie.averageRating ?? "—"}
            </span>
            <span style={{ color: "rgba(255,255,255,0.55)" }}>
              ({movie.ratingCount ?? 0})
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function MoviesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    async function loadMovies() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${baseUrl}/api/v1/movies?page=0&size=18`);
        if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`);

        const data = await res.json();
        setMovies(data.content || []);
      } catch (e) {
        setError(e.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        padding: 18,
        fontFamily: "system-ui, Arial",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>Movies UI</div>
          <h1 style={{ color: "#fff", margin: "6px 0 0", fontSize: 28 }}>Browse</h1>
        </div>

        <div style={{ height: 16 }} />

        {loading && <div style={{ color: "rgba(255,255,255,0.75)" }}>Loading...</div>}
        {error && <div style={{ color: "crimson" }}>Error: {error}</div>}

        {!loading && !error && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
              gap: 16,
            }}
          >
            {movies.map((m) => (
              <MovieCard key={m.imdbId || m.id} movie={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
