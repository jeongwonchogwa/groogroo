"use client";

import { useEffect } from "react";
import HomeFooter from "./components/HomeFooter";
import TreeContainer from "./components/TreeContainer";
import { userInfoStore } from "@/stores/userInfoStore";
import { redirect } from "next/navigation";
import { userTreeStore } from "@/stores/userTreeStore";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";

const HomePage = () => {
  // 토큰 session에 있는 걸로 가져와야함
  const { userToken } = userInfoStore();

  useEffect(() => {
    // 경로 수정 필요
    if (userToken === "") redirect("/enter");
  }, [userToken]);

  const { setUserTree } = userTreeStore();

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
      setUserTree(data.tree);
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
    <div className="w-full h-[calc(100%-60px)]">
      <div className="mx-5 mb-8">
        <TreeContainer data={data} />
      </div>
      <div>
        <HomeFooter />
      </div>
    </div>
  );
};

export default HomePage;
