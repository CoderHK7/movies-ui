export async function getReviewsByImdbId(imdbId) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const res = await fetch(`${baseUrl}/api/v1/reviews/${imdbId}`);
  const data = await res.json().catch(() => []);

  if (!res.ok) {
    const msg = data?.message || data?.error || `${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  // backend returns List<ReviewResponseDto>
  return Array.isArray(data) ? data : [];
}
