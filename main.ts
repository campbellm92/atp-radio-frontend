import "./style.css";
import { fetchAccessToken } from "./api/auth";
import { fetchPlaylist } from "./api/playlist";
import { initialiseSpotifySDK } from "./spotify/spotifySDK";
import {
  initialiseRadioController,
  bindPlaybackControls,
  handleStateChange,
} from "./spotify/radioController";

(async () => {
  const accessToken = await fetchAccessToken();

  if (!accessToken) {
    console.error("No Spotify access token found");
    return;
  }

  const playlist = await fetchPlaylist();
  if (!playlist) {
    console.error("Playlist could not be found");
    return;
  }

  await startApp(accessToken, playlist);

  console.log("Starting playback with URIs:", playlist);
})();

async function startApp(token: string, playlist: string[]) {
  initialiseRadioController(token, playlist);
  bindPlaybackControls();

  await initialiseSpotifySDK(
    token,
    async (deviceId) => {
      console.log("Spotify device ready:", deviceId);

      const playToggleBtn = document.querySelector(
        ".play-toggle-button"
      ) as HTMLButtonElement | null;

      if (playToggleBtn) playToggleBtn.disabled = false;
    },
    handleStateChange
  );
}
