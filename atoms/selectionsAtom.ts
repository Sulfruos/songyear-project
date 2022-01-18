import { atom } from "recoil";

export const selectionsState = atom({
  key: "selectionsState",
  default: [] as any
});

//we need a selectionsState atom so that the data of the 10 selections
//to display is preserved across all files, which is needed to display
//song data and to make songs playable