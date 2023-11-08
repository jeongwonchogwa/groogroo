import { Tree } from "@/app/types";
import { create } from "zustand";

// 유저의 트리 정보를 보내줌
interface userTreeStoreProps {
  userTree: Tree | null;
  setUserTree: (tree: Tree) => void;
}

export const userTreeStore = create<userTreeStoreProps>((set) => ({
  userTree: null,
  setUserTree: (tree: Tree) => set((prev) => ({ ...prev, userTree: tree })),
}));
