import { atom, selector } from "recoil";

export const yState = atom({
  key: "scrollY",
  default: 0,
});
