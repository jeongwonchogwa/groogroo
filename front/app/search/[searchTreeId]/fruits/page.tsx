"use client";

import { useEffect } from "react";
import { userInfoStore } from "@/stores/userInfoStore";
import { redirect, useRouter } from "next/navigation";
import SearchTreeSection from "./components/SearchTreeSection";
import SearchFruitMessageContainer from "./components/SearchFruitMessageContainer";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Loading from "@/app/components/Loading";
import useUserToken from "@/app/hooks/useUserToken";
import useSearchTree from "@/app/hooks/useSearchTree";
import { fetchWithTokenCheck } from "@/app/components/FetchWithTokenCheck";

const SearchTreeFruitsPage = ({
  params,
}: {
  params: { searchTreeId: number };
}) => {
  const userToken = useUserToken();
  const { treeId, loading, error } = useSearchTree(userToken);

  useEffect(() => {
    if (!loading && !error && treeId === null) {
      redirect("/enter/terms");
    }
  }, [loading, error, treeId]);

  const router = useRouter();

  // 검색 결과 가져오기
  const fetchSearch = async () => {
    try {
      const response = await fetchWithTokenCheck(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/tree/detail/${params.searchTreeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
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
  const { data, isLoading, isError } = useQuery(
    ["searchResultData"],
    fetchSearch
  );
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full h-[100%-60px]">
      <div className="mx-5 my-8">
        <SearchTreeSection
          name={data.name as string}
          imageUrl={data.imageUrl as string}
          fruitsCount={data.fruitsCount as number}
        />
      </div>
      <div className="mx-4 my-4 h-full">
        <SearchFruitMessageContainer data={data.fruits} />
      </div>
    </div>
  );
};
export default SearchTreeFruitsPage;
