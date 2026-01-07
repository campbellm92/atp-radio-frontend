export {};

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady?: () => void;
  }

  const Spotify: {
    Player: new (options: {
      name: string;
      getOAuthToken: (cb: (token: string) => void) => void;
      volume?: number;
    }) => any;
  };
}
