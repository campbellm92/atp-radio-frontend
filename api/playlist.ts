import { BASE_URL } from "./baseURL";
import { handleAuthFailure } from "./authFailure";

export type PlaylistResponse = {
  tracks: {
    track_uri: string;
  }[];
};

export async function fetchPlaylist(): Promise<PlaylistResponse> {
  const response = await fetch(`${BASE_URL}/play`, {
    credentials: "include",
  });

  if (!response.ok) {
    handleAuthFailure(response);
  }

  const data = await response.json();
  return data as PlaylistResponse;
}
