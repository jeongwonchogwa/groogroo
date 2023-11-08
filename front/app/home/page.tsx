"use client";

import { useEffect } from "react";
import HomeFooter from "./components/HomeFooter";
import TreeContainer from "./components/TreeContainer";
import { userInfoStore } from "@/stores/userInfoStore";
import { redirect } from "next/navigation";
import { userTreeStore } from "@/stores/userTreeStore";

const HomePage = () => {
  const { userToken } = userInfoStore();
  useEffect(() => {
    // 경로 수정 필요
    if (userToken === "") redirect("/");
  }, [userToken]);

  const { setUserTree } = userTreeStore();

  // 내 나무 불러오기, 이 정보는 store에 저장할게요, 캐싱을 사용해서 수정해야함
  // useQuery를 공부해보세요.......
  const fetchTreeData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/tree`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.status === 200) {
        const responseData = await response.json();
        setUserTree(responseData.tree);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTreeData();
  }, []);

  return (
    <div className="w-full h-[calc(100%-60px)]">
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
