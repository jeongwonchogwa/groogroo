"use client";

import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import SearchContainer from "./components/SearchContainer";
import { userInfoStore } from "@/stores/userInfoStore";
import { Tree } from "@/app/types";
import SearchInitnalMessage from "./components/SearchInitialMessage";
import { redirect, useRouter } from "next/navigation";
import { userTreeStore } from "@/stores/userTreeStore";
import useSearchTree from "../hooks/useSearchTree";
import useUserToken from "../hooks/useUserToken";
import { fetchWithTokenCheck } from "../components/FetchWithTokenCheck";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";
import Image from "next/image";

const SearchPage = () => {
  const userToken = useUserToken();
  const { treeId, loading, error } = useSearchTree(userToken);

  useEffect(() => {
    if (!loading && !error && treeId === null) {
      redirect("/enter/terms");
    }
  }, [loading, error, treeId]);

  const [clickSearch, setClickSearch] = useState<boolean>(false);

  const handleSearch = () => {
    setClickSearch(true);
  };

  const [treeSearchInput, setTreeSearchInput] = useState<string>("");

  const handleInput = (e: any) => {
    const { value } = e.target;
    setClickSearch(false);
    setTreeSearchInput(value);
  };

  // useEffect(() => {
  //   if (clickSearch) {
  //     fetchSearch(treeSearchInput);
  //   }
  // }, [clickSearch, treeSearchInput]);

  const [searchData, setSearchData] = useState<Tree[]>([]);

  const router = useRouter();
  // 검색 결과 가져오기
  const fetchSearch = async (name: string) => {
    if (name === "") {
      return [];
    }
    try {
      const response = await fetchWithTokenCheck(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/tree/search/${name}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${userToken}`,
          },
        },
        router
      );
      if (response.status === 200) {
        const data = await response.json();
        setSearchData(data.trees);

        return data.trees;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { data, isLoading, isError } = useQuery(
    ["searchTree", clickSearch],
    () => fetchSearch(treeSearchInput),
    {
      enabled: !!userToken, // userToken이 존재할 때만 쿼리 활성화
    }
  );
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className=" bg-home-background">
      <div className="w-full h-[calc(100%-100px)]">
        <div className="mt-10 mx-5 h-full">
          <SearchBar
            name="search"
            value={treeSearchInput}
            handleInput={handleInput}
            handleSearch={handleSearch}
          />
          <div className="mt-7 w-full h-[calc(100%-120px)]">
            {clickSearch ? (
              isLoading ? (
                //<div>
                <div className="h-[500px] flex flex-col items-center justify-center">
                  <Image
                    alt="로딩중"
                    src="/assets/gif/loading.gif"
                    width={100}
                    height={60}
                    className="w-auto h-full"
                  />
                  <p className=" font-bitBit text-2xl mt-3 text-white">
                    잠시만 기다려주세요
                  </p>
                </div>
              ) : (
                //</div>
                <SearchContainer searchData={data} />
              )
            ) : (
              <SearchInitnalMessage />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
