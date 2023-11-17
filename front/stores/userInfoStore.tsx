import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserInfo {
  userToken: string;
  approachUrl : string;
  setMember: (userToken: string) => void;
  setApproachUrl : (url : string) => void;
}

export const userInfoStore = create(
  persist<UserInfo>(
    (set) => ({
      userToken: "",
      approachUrl : "",
      setMember: (userToken: string) => set({ userToken : userToken }),
      setApproachUrl : (url : string) => set ({approachUrl : url})
    }),
    {
      name: "userInfo", // unique name
      // 추후 storage를 session으로 할지 local로 할지 확인해야함
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
