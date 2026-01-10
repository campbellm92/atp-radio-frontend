import { pause, resume, initialiseSpotifySDK } from "../spotify/spotifySDK";
import { pauseBtnIcon } from "../ui/buttonIcons";
import { fetchAccessToken } from "../api/auth";
import { initialisePlayback } from "../endpoints/playback";
import { fetchPlaylist } from "../api/playlist";

let hasStartedPlayback = false;
let isPlaying = false;

export function initialiseRadio() {
  const playToggleButton = document.querySelector(
    ".play-toggle-button"
  ) as HTMLButtonElement;

  console.log("playToggleButton:", playToggleButton);

  if (!playToggleButton) {
    console.error("Play toggle button not found in DOM");
    return;
  }

  playToggleButton.addEventListener("click", async () => {
    console.log("Button clicked");
    const token = await fetchAccessToken();
    if (!token) return;
    console.log("Token after pressing btn:", token);

    const deviceId = await initialiseSpotifySDK(token);
    console.log("Device ID found during radio init:", deviceId);

    if (!hasStartedPlayback) {
      const playlist = await fetchPlaylist();
      const uris = playlist.tracks.map((track) => track.track_uri);
      console.log("URIs sent to Spotify:", uris);
      console.log("Playlist data:", playlist);
      await initialisePlayback(token, deviceId, uris);
    }
    if (isPlaying) {
      playToggleButton.innerHTML = pauseBtnIcon;
      await pause();
    } else {
      await resume();
    }
    isPlaying = !isPlaying;
  });
}
