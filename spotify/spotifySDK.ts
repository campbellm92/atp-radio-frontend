let player: any;
let deviceId: string | undefined;
let token: string | null = null;

let onReady: ((deviceId: string) => void) | null = null;
let onStateChange: ((state: any) => void) | null = null;

// inject Spotify SDK player script:
if (
  // ... if not already there:
  !document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]')
) {
  const script = document.createElement("script");
  script.src = "https://sdk.scdn.co/spotify-player.js";
  script.async = true;
  document.body.appendChild(script);
}

// initialise the SDK player:
window.onSpotifyWebPlaybackSDKReady = () => {
  if (!token || !onReady || !onStateChange) {
    console.warn("Spotify SDK ready before init");
    return;
  }

  player = new Spotify.Player({
    name: "ATP Radio Player",
    getOAuthToken: (cb: (token: string) => void) => cb(token!),
    volume: 0.5,
  });

  player.addListener("ready", ({ device_id }: { device_id: string }) => {
    deviceId = device_id;
    onReady!(device_id);
  });

  player.addListener("player_state_changed", onStateChange);

  player.connect().then((success: any) => {
    if (!success) {
      console.error("Failed to connect Spotify player");
    }
  });
};

// mid-level orchestrator:
export function initialiseSpotifySDK(
  accessToken: string,
  readyCb: (deviceId: string) => void,
  stateChangeCb: (state: any) => void
) {
  token = accessToken;
  onReady = readyCb;
  onStateChange = stateChangeCb;

  // handle SDK already loaded
  if ((window as any).Spotify) {
    window.onSpotifyWebPlaybackSDKReady?.();
  }
}

// helper functions:
export function togglePlay() {
  if (!player) throw new Error("Player not initialised");
  return player.togglePlay();
}

export function pause() {
  if (!player) throw new Error("Player not initialised");
  return player.pause();
}

export function resume() {
  if (!player) throw new Error("Player not initialised");
  return player.resume();
}

export function getDeviceId() {
  return deviceId;
}
