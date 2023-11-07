import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserInfo {
  userToken: string;
  setMember: (memberEmail: string) => void;
}

export const userInfoStore = create(
  persist<UserInfo>(
    (set) => ({
      userToken:
        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJraW1qdzM5MjhAbmF2ZXIuY29tIiwiaWQiOjEsInJvbGUiOiJST0xFX0FETUlOIiwiaWF0IjoxNjk5MzQwMjMxLCJleHAiOjE3MDA1NDk4MzF9.lN_XqfzT_gBC_6Cc38ADyI0xaZTt5WV9wSywohVBNQE",
      setMember: (userToken: string) => set({ userToken }),
    }),
    {
      name: "userInfo", // unique name
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
