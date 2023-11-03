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
        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhYWE1MDExQG5hdmVyLmNvbSIsImlkIjoxLCJyb2xlIjoiUk9MRV9VU0VSIiwiaWF0IjoxNjk4OTA3NzkyLCJleHAiOjE3MDAxMTczOTJ9.7Q6gIV8wJw6ejdEqBWd4dztbL6HUuHgGcuf7jDz2_AY",
      setMember: (userToken: string) => set({ userToken }),
    }),
    {
      name: "userInfo", // unique name
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
