import { pause, resume, getDeviceId } from "../spotify/spotifySDK";
import { playBtnIcon, pauseBtnIcon } from "../ui/buttonIcons";
import { initialisePlayback } from "../spotify/playback";

let token: string | null = null;
let playlist: string[] = [];

let hasStartedPlayback = false;
let isPlaying = false;

const playToggleBtn = document.querySelector(
  ".play-toggle-button"
) as HTMLButtonElement | null;

export function initialiseRadioController(accessToken: string, uris: string[]) {
  token = accessToken;
  playlist = uris;
}

export function bindPlaybackControls() {
  if (!playToggleBtn) return;

  playToggleBtn?.addEventListener("click", async () => {
    const deviceId = getDeviceId();
    if (!deviceId || !token) return;

    if (!hasStartedPlayback) {
      await initialisePlayback(token, deviceId, playlist);
      hasStartedPlayback = true;
      isPlaying = true;
      playToggleBtn.innerHTML = pauseBtnIcon;
      playToggleBtn.setAttribute("aria-label", "Pause");
      document.body.classList.add("playing");

      return;
    }
    if (isPlaying) {
      await pause();
    } else {
      await resume();
    }
    console.log("Play clicked", {
      hasStartedPlayback,
      isPlaying,
      deviceId: getDeviceId(),
    });
  });
}

export function handleStateChange(state: any) {
  if (!state || !playToggleBtn) return;

  isPlaying = !state.paused;

  playToggleBtn!.innerHTML = isPlaying ? pauseBtnIcon : playBtnIcon;
  playToggleBtn!.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
  document.body.classList.toggle("playing", isPlaying);
}
