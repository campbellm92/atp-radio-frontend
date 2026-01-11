// hit the Spotify API endpoint that handles playback
export async function initialisePlayback(
  token: string,
  deviceId: string,
  uris: string[]
) {
  const response = await fetch(
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
  if (!response.ok) {
    const error = await response.text();
    console.error("Playback init failed:", response.status, error);
  }
}

export async function goToPrevious(token: string, deviceId: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/me/player/previous?device_id=${deviceId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    const error = await response.text();
    console.error("Playback init failed:", response.status, error);
  }
}

export async function goToNext(token: string, deviceId: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/me/player/next?device_id=${deviceId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    const error = await response.text();
    console.error("Playback init failed:", response.status, error);
  }
}
