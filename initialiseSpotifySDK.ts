let player: any;
let deviceId: string | undefined;

export function initialiseSpotifyPlayer(
  token: string,
  onReady: (deviceId: string) => void,
  onStateChange: (state: any) => void
) {
  window.onSpotifyWebPlaybackSDKReady = () => {
    player = new Spotify.Player({
      name: "My Radio Player",
      getOAuthToken: (cb: (token: string) => void) => cb(token),
      volume: 0.5,
    });

    player.addListener("ready", ({ device_id }: { device_id: string }) => {
      deviceId = device_id;
      onReady(device_id);
    });

    player.addListener("player_state_changed", onStateChange);

    player.connect();
  };
}
