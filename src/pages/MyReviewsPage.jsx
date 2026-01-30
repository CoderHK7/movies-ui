import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyReviews } from "../api/myReviewsApi";

export default function MyReviewsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await getMyReviews();
        if (!cancelled) setItems(data);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Could not load your reviews");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh", padding: 18 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, letterSpacing: -0.3 }}>
          My Reviews
        </h1>

        <div style={{ height: 12 }} />

        {loading ? (
          <div style={{ color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>
            Loading your reviews...
          </div>
        ) : error ? (
          <div style={{ color: "salmon", fontWeight: 700 }}>{error}</div>
        ) : items.length === 0 ? (
          <div style={{ color: "rgba(255,255,255,0.75)", fontWeight: 700 }}>
            You haven’t reviewed anything yet.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {items.map((r) => {
              const created = r.createdAt
                ? new Date(r.createdAt).toLocaleString()
                : "";

              return (
                <div
                  key={r.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "72px 1fr",
                    gap: 12,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: 16,
                    padding: 12,
                  }}
                >
                  <Link to={`/movies/${r.imdbId}`} style={{ textDecoration: "none" }}>
                    <img
                      src={r.moviePoster}
                      alt={r.movieTitle}
                      style={{
                        width: 72,
                        height: 96,
                        objectFit: "cover",
                        borderRadius: 12,
                        border: "1px solid rgba(255,255,255,0.10)",
                      }}
                    />
                  </Link>

                  <div>
                    <Link
                      to={`/movies/${r.imdbId}`}
                      style={{
                        textDecoration: "none",
                        color: "rgba(255,255,255,0.95)",
                        fontWeight: 900,
                        fontSize: 16,
                      }}
                    >
                      {r.movieTitle}
                    </Link>

                    <div style={{ marginTop: 6, color: "rgba(255,255,255,0.7)", fontWeight: 700 }}>
                      ⭐ {r.rating ?? "—"}{" "}
                      <span style={{ color: "rgba(255,255,255,0.45)", fontWeight: 700 }}>
                        {created ? `• ${created}` : ""}
                      </span>
                    </div>

                    <div style={{ marginTop: 8, color: "rgba(255,255,255,0.82)", fontWeight: 600 }}>
                      {r.body}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
