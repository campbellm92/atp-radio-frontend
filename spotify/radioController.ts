import {
  pause,
  resume,
  getDeviceId,
  initialiseSpotifySDK,
  onPlayerStateChange,
} from "../spotify/spotifySDK";
import { fetchAccessToken } from "../api/auth";
import { fetchPlaylist } from "../api/playlist";
import {
  initialisePlayback,
  goToNext,
  goToPrevious,
} from "../endpoints/playback";
import { BACKEND_BASE_URL } from "../config/urls";

let hasStartedPlayback = false;
let isPlaying = false;
let currentToken: string | null = null;

const pauseBtnIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor" class="icon-button"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M176 96C149.5 96 128 117.5 128 144L128 496C128 522.5 149.5 544 176 544L240 544C266.5 544 288 522.5 288 496L288 144C288 117.5 266.5 96 240 96L176 96zM400 96C373.5 96 352 117.5 352 144L352 496C352 522.5 373.5 544 400 544L464 544C490.5 544 512 522.5 512 496L512 144C512 117.5 490.5 96 464 96L400 96z"/></svg>`;
const playBtnIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" class="icon-button"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M73 39C59.2 29.3 40.6 29.8 27.4 40.1S0 66.9 0 83.9L0 428.1c0 17 9.4 32.6 24.6 40.6s33.4 7.1 47.2-2.7l288-216c12.1-9.1 19.2-23.3 19.2-38.3s-7.1-29.2-19.2-38.3L73 39z"/></svg>`;

function updateTrackInfo(state: any) {
  const trackInfoWrapper = document.getElementById("track-info");
  if (!state || !state.track_window?.current_track) {
    if (trackInfoWrapper) {
      trackInfoWrapper.style.display = "none";
    }
    return;
  }

  const track = state.track_window.current_track;

  const trackName = document.getElementById("track-name");
  const artistName = document.getElementById("artist-name");
  const albumArt = document.getElementById("album-art") as HTMLImageElement;

  if (trackInfoWrapper) {
    trackInfoWrapper.style.display = "flex";
  }

  if (trackName) trackName.textContent = track.name;
  if (artistName)
    artistName.textContent = track.artists.map((a: any) => a.name).join(", ");
  if (albumArt && track.album?.images?.[0]) {
    albumArt.src = track.album.images[0].url;
  }
}

async function handlePlayClick(playToggleButton: HTMLButtonElement) {
  const token = await fetchAccessToken();

  if (!token) {
    localStorage.setItem("pendingPlayback", "true");
    window.location.href = `${BACKEND_BASE_URL}/login`;
    return;
  }

  currentToken = token;
  console.log("Token after pressing btn:", token);

  const deviceId = await initialiseSpotifySDK(token);
  console.log("Device ID found during radio init:", deviceId);

  const panel = document.querySelector(".panel");

  if (!hasStartedPlayback) {
    playToggleButton.innerHTML = pauseBtnIcon;
    const playlist = await fetchPlaylist();
    const uris = playlist.tracks.map((track) => track.track_uri);
    await initialisePlayback(token, deviceId, uris);
    hasStartedPlayback = true;
    isPlaying = true;
  } else {
    if (isPlaying) {
      await pause();
      playToggleButton.innerHTML = playBtnIcon;
    } else {
      playToggleButton.innerHTML = pauseBtnIcon;
      await resume();
    }
  }
  isPlaying = !isPlaying;
}

async function handlePreviousClick() {
  const deviceId = getDeviceId();

  if (currentToken && deviceId) {
    await goToPrevious(currentToken, deviceId);
  }
}

async function handleNextClick() {
  const deviceId = getDeviceId();

  if (currentToken && deviceId) {
    await goToNext(currentToken, deviceId);
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

  onPlayerStateChange((state) => {
    updateTrackInfo(state);
  });

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
