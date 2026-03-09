import "./spotify/spotifySDK";
import "./styles.css";

import { initialiseRadio } from "./spotify/radioController";

document.addEventListener("DOMContentLoaded", () => {
  initialiseRadio();
});
