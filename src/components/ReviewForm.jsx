import { useState } from "react";
import { postReview } from "../api/reviewsApi";
import { getToken } from "../auth/token";
import { Link } from "react-router-dom";

/* ---------------- STAR RATING ---------------- */
function StarRating({ value, onChange }) {
  const [hoverValue, setHoverValue] = useState(null);

  const displayValue = hoverValue ?? value;

  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {Array.from({ length: 10 }).map((_, i) => {
        const starValue = i + 1;
        const active = starValue <= displayValue;

        return (
          <span
            key={starValue}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHoverValue(starValue)}
            onMouseLeave={() => setHoverValue(null)}
            title={`${starValue}/10`}
            style={{
              cursor: "pointer",
              fontSize: 22,
              lineHeight: 1,
              color: active ? "#FFD700" : "rgba(255,255,255,0.25)",
              transition: "color 120ms ease, transform 120ms ease",
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

/* ---------------- REVIEW FORM ---------------- */
export default function ReviewForm({ imdbId, onSuccess }) {
  const loggedIn = !!getToken();

  const [rating, setRating] = useState(8);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    setMsg("");

    try {
      setLoading(true);
      await postReview({
        imdbId,
        rating,
        body,
      });

      setMsg("Review posted successfully ✅");
      setBody("");

      if (onSuccess) onSuccess();
    } catch (err) {
      setMsg(err.message || "Failed to post review");
    } finally {
      setLoading(false);
    }
  }

  /* -------- NOT LOGGED IN -------- */
  if (!loggedIn) {
    return (
      <div
        style={{
          borderRadius: 16,
          background: "#0b0b0b",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: 16,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 16 }}>Write a review</div>
        <div style={{ marginTop: 8, color: "rgba(255,255,255,0.7)" }}>
          Login required to post a review.
        </div>

        <div style={{ height: 12 }} />

        <Link
          to="/auth"
          style={{
            display: "inline-block",
            textDecoration: "none",
            background: "#fff",
            color: "#000",
            padding: "8px 12px",
            borderRadius: 12,
            fontWeight: 900,
          }}
        >
          Login
        </Link>
      </div>
    );
  }

  /* -------- LOGGED IN -------- */
  return (
    <div
      style={{
        borderRadius: 16,
        background: "#0b0b0b",
        border: "1px solid rgba(255,255,255,0.08)",
        padding: 16,
      }}
    >
      <div style={{ fontWeight: 900, fontSize: 16 }}>Write a review</div>
      <div style={{ marginTop: 6, color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
        Hover to preview • Click to rate
      </div>

      <div style={{ height: 14 }} />

      <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
        {/* Rating */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: 12,
              color: "rgba(255,255,255,0.7)",
              marginBottom: 6,
            }}
          >
            Rating: <b>{rating}/10</b>
          </label>

          <StarRating value={rating} onChange={setRating} />
        </div>

        {/* Review */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: 12,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Review
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={4}
            style={{
              width: "100%",
              boxSizing: "border-box",
              marginTop: 6,
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "#050505",
              color: "#fff",
              outline: "none",
              resize: "vertical",
            }}
          />
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          type="submit"
          style={{
            background: "#fff",
            color: "#000",
            border: 0,
            padding: "10px 14px",
            borderRadius: 14,
            fontWeight: 900,
            cursor: "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Posting..." : "Post Review"}
        </button>

        {msg && (
          <div
            style={{
              fontSize: 13,
              color: msg.includes("success") ? "#8fff8f" : "salmon",
            }}
          >
            {msg}
          </div>
        )}
      </form>
    </div>
  );
}
