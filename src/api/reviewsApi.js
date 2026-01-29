import { getToken } from "../auth/token";

export async function postReview({ imdbId, rating, body }) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const token = getToken();

  if (!token) {
    throw new Error("You are not logged in.");
  }

  const res = await fetch(`${baseUrl}/api/v1/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ imdbId, rating, reviewBody: body }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.message || data?.error || `${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  return data;
}
