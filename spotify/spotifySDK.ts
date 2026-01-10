let sdkReady = false;
let player: any;
let deviceId: string | undefined;

window.onSpotifyWebPlaybackSDKReady = () => {
  console.log("Spotify SDK loaded");
  sdkReady = true;
};

// initialise the SDK player:
export function initialiseSpotifySDK(token: string): Promise<string> {
  if (!sdkReady) {
    throw new Error("Spotify SDK not ready yet");
  }

  if (player && deviceId) {
    return Promise.resolve(deviceId);
  }

  player = new Spotify.Player({
    name: "ATP Radio Player",
    getOAuthToken: (cb) => cb(token),
    volume: 0.5,
  });

  return new Promise((resolve) => {
    player.addListener("ready", ({ device_id }) => {
      deviceId = device_id;
      resolve(device_id);
    });

    player.connect();
  });
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
