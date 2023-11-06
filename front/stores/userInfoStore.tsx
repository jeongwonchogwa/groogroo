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
        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhYWE1MDExQG5hdmVyLmNvbSIsImlkIjoxLCJyb2xlIjoiUk9MRV9VU0VSIiwiaWF0IjoxNjk5MjMxNjIwLCJleHAiOjE2OTkyMzUyMjB9.W42KM99EjTY3VPT9AhIND0_8G3NR7-DsQ4qPwl4GFFs",
      setMember: (userToken: string) => set({ userToken }),
    }),
    {
      name: "userInfo", // unique name
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
