import "./spotify/spotifySDK";
import "./styles.css";

import { initialiseRadio } from "./spotify/radioController";
import { openTooltip } from "./ui/tooltip";

document.addEventListener("DOMContentLoaded", () => {
  initialiseRadio();
  openTooltip();
});
