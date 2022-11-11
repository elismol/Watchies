import { atom } from "recoil";

// recoil state
export const refreshed = atom({
  key: "refreshed",
  default: {
    hasRefreshed: true,
    refresh: true,
  },
});