import { atom } from "recoil";

// recoil state
export const showAccount = atom({
  key: "showAccount",
  default: {
    show: false,
  },
});