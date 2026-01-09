import { BASE_URL } from "./baseURL";
import { handleAuthFailure } from "./authFailure";

export type Playlist = string[];

export async function fetchPlaylist(): Promise<Playlist> {
  const response = await fetch(`${BASE_URL}/play`, {
    credentials: "include",
  });

  if (!response.ok) {
    handleAuthFailure(response);
  }

  const data = await response.json();
  return data as Playlist;
}
