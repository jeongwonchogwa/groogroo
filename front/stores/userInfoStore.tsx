import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserInfo {
  userToken: string;
  setMember: (userToken: string) => void;
}

export const userInfoStore = create(
  persist<UserInfo>(
    (set) => ({
      userToken:
        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhYWE1MDExQG5hdmVyLmNvbSIsImlkIjoyLCJyb2xlIjoiUk9MRV9VU0VSIiwiaWF0IjoxNjk5NTgxODMyLCJleHAiOjE3MDA3OTE0MzJ9.S_oyIB2Yr1dqg8oJ5hPBxRf-KT0Z5qAyZvDMf2q4Jns",
      // "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJraW1qdzM5MjhAbmF2ZXIuY29tIiwiaWQiOjEsInJvbGUiOiJST0xFX0FETUlOIiwiaWF0IjoxNjk5MzQwMjMxLCJleHAiOjE3MDA1NDk4MzF9.lN_XqfzT_gBC_6Cc38ADyI0xaZTt5WV9wSywohVBNQE"
      setMember: (userToken: string) => set({ userToken }),
    }),
    {
      name: "userInfo", // unique name
      // 추후 storage를 session으로 할지 local로 할지 확인해야함
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
