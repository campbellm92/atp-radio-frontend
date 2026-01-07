import "./style.css";

import { fetchAccessToken, fetchPlaylist } from "./api";

(async () => {
  try {
    const token = await fetchAccessToken();
    console.log("Access token:", token);
    const playlist = await fetchPlaylist();
    console.log("Playlist", playlist);
  } catch (err) {
    console.error("Failed to fetch token", err);
  }
})();
