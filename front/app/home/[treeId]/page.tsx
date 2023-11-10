"use client";

import { useEffect } from "react";
import FruitMessageContainer from "./components/FruitMessageContainer";
import TreeSection from "./components/TreeSection";
import { userInfoStore } from "@/stores/userInfoStore";
import { redirect } from "next/navigation";

const TreePage = ({ params }: { params: { treeId: string } }) => {
  // userToken 처리 필요
  const { userToken } = userInfoStore();
  useEffect(() => {
    if (userToken === "") redirect("/");
  }, [userToken]);

  return (
    <div className="w-full">
      <div className="mx-5 my-8">
        <TreeSection />
      </div>
      <div className="mx-4">
        <FruitMessageContainer />
      </div>
    </div>
  );
};
export default TreePage;
