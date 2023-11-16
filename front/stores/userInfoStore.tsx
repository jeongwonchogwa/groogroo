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
        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqanc0MTk5QG5hdmVyLmNvbSIsImlkIjoxLCJyb2xlIjoiUk9MRV9VU0VSIiwiaWF0IjoxNzAwMTE0NjQyLCJleHAiOjE3MDAxMTgyNDJ9.pm2EHxzkfZ_2xLBZN7x54XJiTxNLKZtDXOOpdJsMekY",
      setMember: (userToken: string) => set({ userToken }),
    }),
    {
      name: "userInfo", // unique name
      // 추후 storage를 session으로 할지 local로 할지 확인해야함
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
