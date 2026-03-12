import { handleAuthFailure } from "./authFailure";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);

export type PlaylistResponse = {
  tracks: {
    track_uri: string;
  }[];
};

export async function fetchPlaylist(): Promise<PlaylistResponse> {
  const response = await fetch(`${API_BASE_URL}/play`, {
    credentials: "include",
  });

  if (!response.ok) {
    handleAuthFailure(response);
  }

  const data = await response.json();
  console.log(data);
  return data as PlaylistResponse;
}
