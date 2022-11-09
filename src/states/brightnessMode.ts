import { atom } from "recoil";

// recoil state
export const brightnessMode = atom({
  key: "brightnessMode",
  default: {
    backgroundColor: "black",
    fontColor: "white",
    navbarColor: "#151515",
    enabled: true,
    pressOpacity: 0.85,
    cardColor: "#333333",
    buttonColor: "#7f4aff",
    inputColor: "#dcd7e0",
  },
});