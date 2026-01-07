export type Playlist = string[];

const BASE_URL = "http://127.0.0.1:8000";

function handleAuthFailure(response: Response): never {
  if (response.status === 401) {
    window.location.href = `${BASE_URL}/login`;
  }
  throw new Error(`Request failed: ${response.status}`);
}

export async function fetchAccessToken(): Promise<string> {
  const response = await fetch(`${BASE_URL}/auth/token`, {
    credentials: "include",
  });

  if (!response.ok) {
    handleAuthFailure(response);
  }

  const data = await response.json();
  return data.access_token;
}

export async function fetchPlaylist(): Promise<Playlist> {
  const response = await fetch("http://127.0.0.1:8000/play", {
    credentials: "include",
  });

  if (!response.ok) {
    handleAuthFailure(response);
  }

  const data = await response.json();
  return data as Playlist;
}
