"use client";

import { useEffect } from "react";
import FruitMessageContainer from "./components/FruitMessageContainer";
import TreeSection from "./components/TreeSection";
import { userInfoStore } from "@/stores/userInfoStore";
import { redirect } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/components/Loading";

const TreePage = () => {
  // userToken 처리 필요
  const { userToken } = userInfoStore();
  useEffect(() => {
    if (userToken === "") redirect("/enter");
  }, [userToken]);

  // 내 나무 불러오기, 이 정보는 store에 저장할게요, 캐싱을 사용해서 수정해야함
  const fetchTreeData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/tree`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      const data = await response.json();
      return data.tree;
    } catch (error) {
      console.log(error);
    }
  };

  const { data, isLoading, isError } = useQuery(["userTree"], fetchTreeData);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full">
      <div className="mx-5 my-8">
        <TreeSection treeImg={data.imageUrl} />
      </div>
      <div className="mx-4">
        <FruitMessageContainer fruits={data.fruits} />
      </div>
    </div>
  );
};
export default TreePage;
