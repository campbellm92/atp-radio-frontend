// fetch the Spotify API endpoint that handles playback
export async function initialisePlayback(
  token: string,
  deviceId: string,
  uris: string[]
) {
  await fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris }),
    }
  );
}
