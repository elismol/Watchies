import { atom } from "recoil";

// recoil state
export const brightnessMode = atom({
  key: "brightnessMode",
  default: {
    backgroundColor: "black",
    fontColor: "white",
    navbarColor: "#151515",
    enabled: true,
  },
});