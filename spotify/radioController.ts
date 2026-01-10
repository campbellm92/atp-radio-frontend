import {
  pause,
  resume,
  previous,
  next,
  initialiseSpotifySDK,
} from "../spotify/spotifySDK";
import { fetchAccessToken } from "../api/auth";
import { fetchPlaylist } from "../api/playlist";
import { initialisePlayback } from "../endpoints/playback";
import { BACKEND_BASE_URL } from "../config/urls";

let hasStartedPlayback = false;
let isPlaying = false;

const pauseBtnIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor" class="icon-button"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M176 96C149.5 96 128 117.5 128 144L128 496C128 522.5 149.5 544 176 544L240 544C266.5 544 288 522.5 288 496L288 144C288 117.5 266.5 96 240 96L176 96zM400 96C373.5 96 352 117.5 352 144L352 496C352 522.5 373.5 544 400 544L464 544C490.5 544 512 522.5 512 496L512 144C512 117.5 490.5 96 464 96L400 96z"/></svg>`;

async function handlePlayClick(playToggleButton: HTMLButtonElement) {
  const token = await fetchAccessToken();

  if (!token) {
    localStorage.setItem("pendingPlayback", "true");
    window.location.href = `${BACKEND_BASE_URL}/login`;
    return;
  }

  console.log("Token after pressing btn:", token);

  const deviceId = await initialiseSpotifySDK(token);
  console.log("Device ID found during radio init:", deviceId);

  if (!hasStartedPlayback) {
    playToggleButton.innerHTML = pauseBtnIcon;
    const playlist = await fetchPlaylist();
    const uris = playlist.tracks.map((track) => track.track_uri);
    await initialisePlayback(token, deviceId, uris);
    hasStartedPlayback = true;
  }

  if (isPlaying) {
    await pause();
  } else {
    await resume();
  }

  isPlaying = !isPlaying;
}

async function handlePreviousClick() {
  if (isPlaying) {
    await previous();
  }
}

async function handleNextClick() {
  if (isPlaying) {
    await next();
  }
}

export function initialiseRadio() {
  const playToggleButton = document.getElementById(
    "play-toggle-button"
  ) as HTMLButtonElement;

  const previousButton = document.getElementById(
    "previous-button"
  ) as HTMLButtonElement;

  const nextButton = document.getElementById(
    "next-button"
  ) as HTMLButtonElement;

  if (!playToggleButton) {
    console.error("Play toggle button not found in DOM");
    return;
  }

  playToggleButton.addEventListener("click", () =>
    handlePlayClick(playToggleButton)
  );

  nextButton.addEventListener("click", () => handleNextClick());

  previousButton.addEventListener("click", () => handlePreviousClick());

  if (localStorage.getItem("pendingPlayback") === "true") {
    localStorage.removeItem("pendingPlayback");

    // allow cookies + SDK to settle
    setTimeout(() => {
      handlePlayClick(playToggleButton);
    }, 300);
  }
}
