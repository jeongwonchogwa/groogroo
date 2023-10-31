import { create } from "zustand";

interface gardenEditStore {
  gardenEdit: boolean;
  setGardenEdit: () => void;
}

export const gardenEditStore = create<gardenEditStore>((set) => ({
  gardenEdit: false,
  setGardenEdit: () => {
    set({ gardenEdit: true });
    console.log("끼욧");
  },
}));
