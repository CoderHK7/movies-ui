import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BackdropsCarousel from "../components/BackdropsCarousel";
import TrailerModal from "../components/TrailerModal";
import ReviewForm from "../components/ReviewForm";
import ReviewsList from "../components/ReviewsList";
import { getReviewsByImdbId } from "../api/reviewsReadApi";

export default function MovieDetailsPage() {
  const { imdbId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [movie, setMovie] = useState(null);

  const [trailerOpen, setTrailerOpen] = useState(false);

  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState("");
  const [reviews, setReviews] = useState([]);

  // ✅ ONLY change for fixing count: normalize reviews response into an array
  function normalizeReviews(data) {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.content)) return data.content;
    if (data && Array.isArray(data.reviews)) return data.reviews;
    return [];
  }

  useEffect(() => {
    let cancelled = false;

    async function loadMovie() {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;

      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${baseUrl}/api/v1/movies/${imdbId}`);
        if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`);

        const data = await res.json();
        if (!cancelled) setMovie(data);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMovie();

    return () => {
      cancelled = true;
    };
  }, [imdbId]);

  useEffect(() => {
    let cancelled = false;

    async function loadReviews() {
      try {
        setReviewsLoading(true);
        setReviewsError("");

        const data = await getReviewsByImdbId(imdbId);

        if (!cancelled) setReviews(normalizeReviews(data));
      } catch (e) {
        if (!cancelled) setReviewsError(e?.message || "Could not load reviews");
      } finally {
        if (!cancelled) setReviewsLoading(false);
      }
    }

    loadReviews();

    return () => {
      cancelled = true;
    };
  }, [imdbId]);

  if (loading) {
    return <div style={{ padding: 18 }}>Loading movie...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 18, color: "#ff4d4d" }}>
        Error: {error}
      </div>
    );
  }

  if (!movie) {
    return <div style={{ padding: 18 }}>Movie not found.</div>;
  }

  const director = movie.director || "—";
  const cast = Array.isArray(movie.cast) ? movie.cast : [];

  const releaseDateText = movie.releaseDate
    ? new Date(movie.releaseDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
      })
    : "—";

  // ✅ ONLY change for the bracket number: use normalized reviews length
  const reviewCount = Array.isArray(reviews) ? reviews.length : 0;

  const chipStyle = {
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 0.2,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#fff", padding: 18 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Link to="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>
          ← Back
        </Link>

        <div style={{ height: 14 }} />

        <h1 style={{ margin: 0, fontSize: 36, fontWeight: 800, letterSpacing: -0.4 }}>
          {movie.title}
        </h1>

        <div style={{ marginTop: 8, color: "rgba(255,255,255,0.72)", fontWeight: 600 }}>
          ⭐ {movie.averageRating ?? "—"} ({reviewCount}) • {releaseDateText}
        </div>

        {/* Director + Cast */}
        <div style={{ marginTop: 16 }}>
          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: 800, letterSpacing: 1 }}>
            CREDITS
          </div>

          <div style={{ marginTop: 8, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
            <span style={{ color: "rgba(255,255,255,0.6)", fontWeight: 700 }}>Director:</span>{" "}
            {director}
          </div>

          <div style={{ marginTop: 10 }}>
            <div style={{ color: "rgba(255,255,255,0.6)", fontWeight: 800, fontSize: 12, letterSpacing: 0.6 }}>
              CAST
            </div>

            <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {cast.length ? (
                cast.map((name) => (
                  <span key={name} style={chipStyle}>
                    {name}
                  </span>
                ))
              ) : (
                <span style={{ color: "rgba(255,255,255,0.65)" }}>—</span>
              )}
            </div>
          </div>
        </div>

        <div style={{ height: 18 }} />

        <button
          onClick={() => setTrailerOpen(true)}
          style={{
            background: "#f5c518",
            color: "#000",
            border: "none",
            padding: "10px 14px",
            borderRadius: 12,
            fontWeight: 900,
            cursor: "pointer",
            boxShadow: "0 10px 20px rgba(0,0,0,0.25)",
          }}
        >
          ▶ Play Trailer
        </button>

        <div style={{ height: 18 }} />

        <BackdropsCarousel backdrops={movie.backdrops} />

        <div style={{ height: 16 }} />

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
            color: "rgba(255,255,255,0.75)",
            fontWeight: 600,
          }}
        >
          <span style={{ opacity: 0.7, fontWeight: 800 }}>Genres:</span>{" "}
          {Array.isArray(movie.genres) && movie.genres.length ? movie.genres.join(" • ") : "—"}
        </div>

        <div style={{ height: 22 }} />

        {/* Reviews section */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 18 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, letterSpacing: -0.2 }}>
            Reviews
          </h2>

          <div style={{ height: 14 }} />

          <ReviewForm
            imdbId={imdbId}
            onSuccess={async () => {
              try {
                setReviewsLoading(true);
                const data = await getReviewsByImdbId(imdbId);
                setReviews(normalizeReviews(data));
              } finally {
                setReviewsLoading(false);
              }
            }}
          />

          <div style={{ height: 16 }} />

          {reviewsLoading ? (
            <div style={{ color: "rgba(255,255,255,0.75)" }}>Loading reviews...</div>
          ) : reviewsError ? (
            <div style={{ color: "#ff4d4d" }}>{reviewsError}</div>
          ) : (
            <ReviewsList reviews={reviews} />
          )}
        </div>

        <TrailerModal
          open={trailerOpen}
          onClose={() => setTrailerOpen(false)}
          trailerUrl={movie.trailerLink}
          title={`${movie.title} — Trailer`}
        />
      </div>
    </div>
  );
}
