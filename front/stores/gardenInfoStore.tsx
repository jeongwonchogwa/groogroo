import { gardenExample } from "@/app/dummies";
import { Garden } from "@/app/types";
import { create } from "zustand";

interface GardenInfoStore {
  garden: Garden;
  setGarden: (garden: Garden) => void;
}

export const gardenInfoStore = create<GardenInfoStore>((set) => ({
  garden: gardenExample,
  // garden: {
  //   gardenId: 0,
  //   name: "정원이름",
  //   state: null,
  //   imageUrl: "/assets/map1.json",
  //   capacity: 0,
  //   description: "설명",
  //   treePosList: [{ id: 0, name: "", imagUrl: "", fruitCnt: 0, x: 0, y: 0 }],
  //   flowerPosList: [{ id: 0, imageUrl: "", x: 0, y: 0 }],
  // },
  setGarden: (garden: Garden) => set({ garden: garden }),
}));
