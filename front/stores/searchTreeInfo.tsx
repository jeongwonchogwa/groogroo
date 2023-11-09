import { create } from "zustand";
import { Tree } from "@/app/types";

interface SearchTreeInfo {
  searchTreeInfoData: Tree | null;
  setSearchTreeInfo: (searchTree: Tree) => void;
}

export const searchTreeStore = create<SearchTreeInfo>((set) => ({
  searchTreeInfoData: null,
  setSearchTreeInfo: (searchTree: Tree) => set({ searchTreeInfoData: searchTree }),
}));
