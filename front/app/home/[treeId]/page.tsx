"use client";

import { useEffect, useState } from "react";
import FruitMessageContainer from "./components/FruitMessageContainer";
import TreeSection from "./components/TreeSection";
import { redirect, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/components/Loading";
import useSearchTree from "@/app/hooks/useSearchTree";
import useUserToken from "@/app/hooks/useUserToken";
import { fetchWithTokenCheck } from "@/app/components/FetchWithTokenCheck";

const TreePage = ({ params }: { params: { treeId: string } }) => {
  const userToken = useUserToken();
  const { treeId, loading, error } = useSearchTree(userToken);

  useEffect(() => {
    if (!loading && !error && treeId === null) {
      redirect("/enter/terms");
    }
  }, [loading, error, treeId]);

  const router = useRouter();

  const fetchTreeData = async () => {
    try {
      const response = await fetchWithTokenCheck(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/tree`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
        router
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
    <div className="w-full h-[calc(100%-60px)] flex flex-col justify-center">
      <div className="mt-2 mx-5 mb-8">
        <TreeSection name={data.name} fruitsCount={data.fruitsCount} treeImg={data.imageUrl} />
      </div>
      <div className="mx-4 mt-5">
        <FruitMessageContainer fruits={data.fruits} />
      </div>
    </div>
  );
};
export default TreePage;
