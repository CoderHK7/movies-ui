function getTrailerEmbed(url) {
  if (!url) return { type: "none", src: "" };

  const lower = url.toLowerCase();

  // YouTube link
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) {
    try {
      const parsed = new URL(url);

      let id = "";
      if (parsed.hostname.includes("youtu.be")) {
        id = parsed.pathname.replace("/", "");
      } else {
        id = parsed.searchParams.get("v") || "";
      }

      const embed = id ? `https://www.youtube.com/embed/${id}?autoplay=1` : "";
      return embed ? { type: "youtube", src: embed } : { type: "link", src: url };
    } catch {
      return { type: "link", src: url };
    }
  }

  // Direct MP4 link
  if (lower.includes(".mp4")) {
    return { type: "mp4", src: url };
  }

  // Fallback: open link
  return { type: "link", src: url };
}

export default function TrailerModal({ open, onClose, trailerUrl, title }) {
  if (!open) return null;

  const { type, src } = getTrailerEmbed(trailerUrl);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "grid",
        placeItems: "center",
        zIndex: 1000,
        padding: 16,
        fontFamily: "system-ui, Arial",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(1000px, 95vw)",
          borderRadius: 18,
          overflow: "hidden",
          background: "#0b0b0b",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          color: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 14px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ fontWeight: 700 }}>{title || "Trailer"}</div>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.16)",
              color: "#fff",
              padding: "6px 10px",
              borderRadius: 12,
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Close
          </button>
        </div>

        <div style={{ width: "100%", aspectRatio: "16 / 9", background: "#000" }}>
          {type === "youtube" && (
            <iframe
              src={src}
              title="Trailer"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          )}

          {type === "mp4" && (
            <video src={src} controls autoPlay style={{ width: "100%", height: "100%" }} />
          )}

          {type === "link" && (
            <div style={{ padding: 16, color: "rgba(255,255,255,0.85)" }}>
              This trailer link can’t be embedded here.
              <div style={{ height: 10 }} />
              <a
                href={src}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#fff", textDecoration: "underline" }}
              >
                Open trailer in new tab →
              </a>
            </div>
          )}

          {type === "none" && (
            <div style={{ padding: 16, color: "rgba(255,255,255,0.85)" }}>
              No trailer available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
