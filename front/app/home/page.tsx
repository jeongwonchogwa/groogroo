"use client";

import { useEffect, useState } from "react";
import HomeFooter from "./components/HomeFooter";
import TreeContainer from "./components/TreeContainer";
import { userInfoStore } from "@/stores/userInfoStore";
import { redirect, useRouter } from "next/navigation";
import { userTreeStore } from "@/stores/userTreeStore";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";
import { fetchWithTokenCheck } from "../components/FetchWithTokenCheck";
import useSearchTree from "../hooks/useSearchTree";
import useUserToken from "../hooks/useUserToken";

const HomePage = () => {
  const userToken = useUserToken();
  const { treeId, loading, error } = useSearchTree(userToken);

  useEffect(() => {
    if (!loading && !error && treeId === null) {
      redirect("/enter/terms");
    }
  }, [loading, error, treeId]);

  const { setUserTree } = userTreeStore();
  const router = useRouter();

  const fetchTreeData = async () => {
    if (!userToken) return; // userToken이 없으면 함수 실행 중단
    try {
      let url = `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/tree`;
      const response = await fetchWithTokenCheck(
        url,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
        router
      );
      const data = await response.json();
      setUserTree(data.tree);
      return data.tree;
    } catch (error) {
      console.log(error);
    }
  };

  const { data, isLoading, isError } = useQuery(["userTree"], fetchTreeData, {
    enabled: !!userToken, // userToken이 존재할 때만 쿼리 활성화
  });

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
