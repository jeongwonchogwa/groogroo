"use client";

import { useEffect } from "react";
import HomeFooter from "./components/HomeFooter";
import TreeContainer from "./components/TreeContainer";
import { redirect, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";
import useSearchTree from "../hooks/useSearchTree";
import useUserToken from "../hooks/useUserToken";
import { fetchTreeData } from "../services/fetchTreeData";

const HomePage = () => {
  const userToken = useUserToken();
  const { treeId, loading, error } = useSearchTree(userToken);

  useEffect(() => {
    if (!loading && !error && treeId === null) {
      redirect("/enter/terms");
    }
  }, [loading, error, treeId]);

  const router = useRouter();

  const { data, isLoading, isError } = useQuery(["userTree"], () => fetchTreeData(userToken, router), {
    enabled: !!userToken, // userToken이 존재할 때만 쿼리 활성화
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full h-[calc(100%-60px)] flex flex-col justify-evenly">
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
