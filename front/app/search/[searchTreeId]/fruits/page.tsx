"use client";

import { useEffect } from "react";
import { userInfoStore } from "@/stores/userInfoStore";
import { redirect } from "next/navigation";
import SearchTreeSection from "./components/SearchTreeSection";
import SearchFruitMessageContainer from "./components/SearchFruitMessageContainer";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Loading from "@/app/components/Loading";

const SearchTreeFruitsPage = () => {
  // userToken을 이렇게 받으면 안됩니다.
  const { userToken } = userInfoStore();
  useEffect(() => {
    if (userToken === "") redirect("/enter");
  }, [userToken]);

  // 검색 결과 가져오기
  const fetchSearch = async (name: string) => {
    if (name === "") {
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/tree/${name}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      const data = await response.json();
      return data.trees[0];
    } catch (error) {
      console.log(error);
    }
  };
  const name = useSearchParams().get("name");
  const { data, isLoading, isError } = useQuery(["searchResultData"], () =>
    fetchSearch(name as string)
  );
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full h-[100%-60px]">
      <div className="mx-5 my-8">
        <SearchTreeSection
          name={name as string}
          imageUrl={data.imageUrl as string}
        />
      </div>
      <div className="mx-4 my-4 h-full">
        <SearchFruitMessageContainer data={data.fruits} />
      </div>
    </div>
  );
};
export default SearchTreeFruitsPage;
