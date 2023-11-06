"use client";

import { useEffect } from "react";
import HomeFooter from "./components/HomeFooter";
import TreeContainer from "./components/TreeContainer";
import { userInfoStore } from "@/stores/userInfoStore";
import { redirect } from "next/navigation";

const HomePage = () => {
  const { userToken } = userInfoStore();

  useEffect(() => {
    // 경로 수정 필요
    if (userToken === "") redirect("/");
  }, [userToken]);
  return (
    <div className="w-full h-[784px]">
      <div className="mx-5 mb-8">
        <TreeContainer />
      </div>
      <div>
        <HomeFooter />
      </div>
    </div>
  );
};

export default HomePage;
