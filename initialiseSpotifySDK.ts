let player: any;
let deviceId: string | undefined;

export async function initialiseSpotifySDK(
  token: string,
  onReady: (deviceId: string) => void,
  onStateChange: (state: any) => void
) {
  return new Promise<void>((resolve, reject) => {
    window.onSpotifyWebPlaybackSDKReady = async () => {
      player = new Spotify.Player({
        name: "ATP Radio Player",
        getOAuthToken: (cb: (token: string) => void) => cb(token),
        volume: 0.5,
      });

      player.addListener("ready", ({ device_id }: { device_id: string }) => {
        deviceId = device_id;
        onReady(device_id);
      });

      player.addListener("player_state_changed", onStateChange);

      try {
        const success = await player.connect();

        if (!success) {
          reject("Failed to connect to Spotify player");
          return;
        }
        console.log("Successfully connected to the Spotify player!");
        resolve();
      } catch (error) {
        reject(error);
      }
    };
  });
}
