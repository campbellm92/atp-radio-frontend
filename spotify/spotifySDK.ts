import { fetchSpotifyToken } from "../api/auth";

let sdkReady = false;
let player: any;
let deviceId: string | undefined;
let stateChangeCallback: ((state: any) => void) | null = null;
let initPromise: Promise<string> | null = null;

window.onSpotifyWebPlaybackSDKReady = () => {
  console.log("Spotify SDK loaded");
  sdkReady = true;
};

// initialise the SDK player:
export function initialiseSpotifySDK(): Promise<string> {
  if (!sdkReady) {
    throw new Error("Spotify SDK not ready yet");
  }

  if (deviceId) {
    return Promise.resolve(deviceId);
  }

  if (initPromise) {
    console.log("Init already in progress, returning existing promise");
    return initPromise;
  }

  player = new Spotify.Player({
    name: "ATP Radio Player",
    getOAuthToken: async (cb) => {
      const freshToken = await fetchSpotifyToken(); // always fetch fresh
      if (freshToken) cb(freshToken);
    },
    volume: 0.5,
  });

  initPromise = new Promise((resolve, reject) => {
    player.addListener("ready", ({ device_id }) => {
      deviceId = device_id;
      resolve(device_id);
    });

    player.addListener("not_ready", ({ device_id }) => {
      console.error("Spotify SDK not ready, device_id:", device_id);
    });

    player.addListener("initialization_error", ({ message }) => {
      console.error("Spotify SDK initialization error:", message);
      initPromise = null;
      reject(new Error(message));
    });

    player.addListener("authentication_error", ({ message }) => {
      console.error("Spotify SDK authentication error:", message);
      initPromise = null;
      reject(new Error(message));
    });

    player.addListener("player_state_changed", (state) => {
      if (state && stateChangeCallback) {
        stateChangeCallback(state);
      }
    });
    player.connect();
  });
  return initPromise;
}

export function onPlayerStateChange(callback: (state: any) => void) {
  stateChangeCallback = callback;
}

// helper functions:
export function getDeviceId() {
  return deviceId;
}

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

export function previous() {
  if (!player) throw new Error("Player not initialised");
  return player.previousTrack();
}

export function next() {
  if (!player) throw new Error("Player not initialised");
  return player.nextTrack();
}
