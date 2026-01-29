export default function ReviewsList({ reviews }) {
  return (
    <div
      style={{
        borderRadius: 16,
        background: "#0b0b0b",
        border: "1px solid rgba(255,255,255,0.08)",
        padding: 16,
      }}
    >
      <div style={{ fontWeight: 900, fontSize: 16 }}>Reviews</div>

      <div style={{ height: 12 }} />

      {(!reviews || reviews.length === 0) ? (
        <div style={{ color: "rgba(255,255,255,0.7)" }}>
          No reviews yet. Be the first one.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {reviews.map((r) => (
            <div
              key={r.id}
              style={{
                padding: 12,
                borderRadius: 14,
                background: "#050505",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontWeight: 800 }}>⭐ {r.rating ?? "—"}</div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
                  #{r.id}
                </div>
              </div>

              <div style={{ marginTop: 8, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>
                {r.body}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
