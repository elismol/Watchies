import { atom } from "recoil";
import { darkMode } from "../themes/themes";

// recoil state
export const brightnessMode = atom({
  key: "brightnessMode",
  default: darkMode,
});