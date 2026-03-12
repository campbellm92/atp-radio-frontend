const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);

export async function fetchSpotifyToken(): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/spotify-token`, {
      credentials: "include",
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.access_token;
  } catch {
    return null;
  }
}
