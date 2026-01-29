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

  async function loadMovie() {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${baseUrl}/api/v1/movies/${imdbId}`);
      if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`);

      const data = await res.json();
      setMovie(data);
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function loadReviews() {
    try {
      setReviewsLoading(true);
      setReviewsError("");
      const list = await getReviewsByImdbId(imdbId);
      setReviews(list);
    } catch (e) {
      setReviewsError(e.message || "Failed to load reviews");
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  }

  async function refreshAll() {
    await Promise.all([loadMovie(), loadReviews()]);
  }

  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imdbId]);

  if (loading) {
    return (
      <div style={{ padding: 16, fontFamily: "system-ui, Arial" }}>
        Loading movie...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 16, fontFamily: "system-ui, Arial", color: "crimson" }}>
        Error: {error}
      </div>
    );
  }

  if (!movie) {
    return (
      <div style={{ padding: 16, fontFamily: "system-ui, Arial" }}>
        Movie not found.
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#fff", padding: 18 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", fontFamily: "system-ui, Arial" }}>
        <Link to="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>
          ← Back
        </Link>

        <div style={{ height: 14 }} />

        <h1 style={{ margin: 0, fontSize: 30 }}>{movie.title}</h1>

        <div style={{ marginTop: 8, color: "rgba(255,255,255,0.7)" }}>
          {movie.imdbId} • ⭐ {movie.averageRating ?? "—"} ({movie.ratingCount ?? 0})
        </div>

        <div style={{ height: 14 }} />

        <button
          onClick={() => setTrailerOpen(true)}
          style={{
            background: "#fff",
            color: "#000",
            border: 0,
            padding: "10px 14px",
            borderRadius: 14,
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          ▶ Play Trailer
        </button>

        <div style={{ height: 18 }} />

        <BackdropsCarousel backdrops={movie.backdrops} />

        <div style={{ height: 16 }} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: 16,
          }}
        >
          {/* About */}
          <div
            style={{
              borderRadius: 16,
              background: "#0b0b0b",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: 16,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 16 }}>About</div>
            <div style={{ marginTop: 8, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
              Genres: {(movie.genres || []).join(", ") || "—"}
              <br />
              Release: {movie.releaseDate || "—"}
            </div>
          </div>

          {/* Review form */}
          <ReviewForm
            imdbId={movie.imdbId}
            onSuccess={async () => {
              // After posting: refresh movie rating + reviews list
              await refreshAll();
            }}
          />
        </div>

        <div style={{ height: 16 }} />

        {/* Reviews section */}
        {reviewsLoading ? (
          <div style={{ color: "rgba(255,255,255,0.75)" }}>Loading reviews...</div>
        ) : reviewsError ? (
          <div style={{ color: "salmon" }}>Reviews error: {reviewsError}</div>
        ) : (
          <ReviewsList reviews={reviews} />
        )}

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
