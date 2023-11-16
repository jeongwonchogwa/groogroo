import { create } from "zustand";

interface GameInfoStore {
  game: Phaser.Game | undefined;
  setGame: (game: Phaser.Game) => void;
}

export const gameInfoStore = create<GameInfoStore>((set) => ({
  game: undefined,
  setGame: (game: Phaser.Game) => set({ game: game }),
}));
