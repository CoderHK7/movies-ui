import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie.imdbId}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          borderRadius: 16,
          overflow: "hidden",
          background: "#0b0b0b",
          color: "#fff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ width: "100%", aspectRatio: "2/3", background: "rgba(255,255,255,0.04)" }}>
          <img
            src={movie.poster}
            alt={movie.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <div style={{ padding: 12 }}>
          <div style={{ fontWeight: 900, lineHeight: 1.2 }}>{movie.title}</div>
          <div style={{ marginTop: 6, color: "rgba(255,255,255,0.72)", fontWeight: 700, fontSize: 13 }}>
            ⭐ {movie.averageRating ?? "—"} • {movie.releaseDate ?? "—"}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function LatestPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    async function loadMovies() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${baseUrl}/api/v1/movies/latest`);
        if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`);

        const data = await res.json();
        setMovies(Array.isArray(data) ? data : (data.content || []));
      } catch (e) {
        setError(e.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, []);

  return (
    <div style={{ minHeight: "100vh", padding: 18 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, letterSpacing: -0.3 }}>
          Latest
        </h1>

        <div style={{ height: 14 }} />

        {loading ? (
          <div style={{ color: "rgba(255,255,255,0.75)", fontWeight: 700 }}>Loading...</div>
        ) : error ? (
          <div style={{ color: "salmon", fontWeight: 800 }}>{error}</div>
        ) : (
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
