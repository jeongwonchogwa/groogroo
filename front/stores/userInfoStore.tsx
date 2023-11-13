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
        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJraW1qdzM5MjhAZ21haWwuY29tIiwiaWQiOjU5LCJyb2xlIjoiUk9MRV9VU0VSIiwiaWF0IjoxNjk5MzM3OTc1LCJleHAiOjE3MDA1NDc1NzV9.Ql31eBvnvari9_g4o-s46SsURV9egVz1wcCo2m1vxVw",
      setMember: (userToken: string) => set({ userToken }),
    }),
    {
      name: "userInfo", // unique name
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
