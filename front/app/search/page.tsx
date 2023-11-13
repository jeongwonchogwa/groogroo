"use client";

import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import SearchContainer from "./components/SearchContainer";
import { userInfoStore } from "@/stores/userInfoStore";
import { Tree } from "@/app/types";
import SearchInitnalMessage from "./components/SearchInitialMessage";
import { redirect } from "next/navigation";
import { userTreeStore } from "@/stores/userTreeStore";

const SearchPage = () => {
  // 토큰 처리 필요
  const { userToken } = userInfoStore();

  useEffect(() => {
    // 경로 수정 필요
    if (userToken === "") redirect("/enter");
  }, [userToken]);

  const [clickSearch, setClickSearch] = useState<boolean>(false);

  const handleSearch = () => {
    setClickSearch((prev) => !prev);
  };

  const [treeSearchInput, setTreeSearchInput] = useState<string>("");

  const handleInput = (e: any) => {
    const { value } = e.target;
    setTreeSearchInput(value);
  };

  useEffect(() => {
    if (clickSearch) {
      fetchSearch(treeSearchInput);
    }
  }, [clickSearch, treeSearchInput]);

  const [searchData, setSearchData] = useState<Tree[]>([]);
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
      if (response.status === 200) {
        const responseData = await response.json();
        setSearchData(responseData.trees);
      }
    } catch (error) {
      console.log(error);
    }
  };
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
              <SearchContainer searchData={searchData} />
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
