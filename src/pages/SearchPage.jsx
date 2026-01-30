import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

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
        <div style={{ width: "100%", aspectRatio: "2/3" }}>
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

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    async function run() {
      if (!q) {
        setMovies([]);
        setError("");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `${baseUrl}/api/v1/movies/search?title=${encodeURIComponent(q)}&page=0&size=20`
        );

        if (!res.ok) {
          throw new Error(`Search failed: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.content || []);

        if (!cancelled) setMovies(list);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Search failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [q]);

  return (
    <div style={{ minHeight: "100vh", padding: 18 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, letterSpacing: -0.3 }}>
          Search
        </h1>

        <div style={{ marginTop: 8, color: "rgba(255,255,255,0.72)", fontWeight: 700 }}>
          {q ? (
            <>Results for: <span style={{ color: "#f5c518" }}>{q}</span></>
          ) : (
            <>Type something in the search bar.</>
          )}
        </div>

        <div style={{ height: 14 }} />

        {loading ? (
          <div style={{ color: "rgba(255,255,255,0.75)", fontWeight: 700 }}>
            Searching...
          </div>
        ) : error ? (
          <div style={{ color: "salmon", fontWeight: 800 }}>{error}</div>
        ) : q && movies.length === 0 ? (
          <div style={{ color: "rgba(255,255,255,0.75)", fontWeight: 700 }}>
            No movies found.
          </div>
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
