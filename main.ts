import "./spotify/spotifySDK";
import "./style.css";

import { initialiseRadio } from "./spotify/radioController";

document.addEventListener("DOMContentLoaded", () => {
  initialiseRadio();
});

/*
The steps:

1) load the token when the person visits the app, that way playback is a matter of a) fetch a playlist, b) play the playlist
2) onclick -> 
    a) fetch the playlist information (backend endpoint) so it's loaded
    b) meanwhile: do the auth and set the token
    c) fetch the spotify playback endpoint and plug in the already loaded playlist information
    d) play the playlist
*/
