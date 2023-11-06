"use client";

import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import SearchContainer from "./components/SearchContainer";
import { userInfoStore } from "@/stores/userInfoStore";
import { Tree } from "@/app/types";

const SearchPage = () => {
  const userToken = userInfoStore();

  const [clickSearch, setClickSearch] = useState<boolean>(false);

  const handleSearch = () => {
    setClickSearch((prev) => !prev);
  };

  const [treeSearchInput, setTreeSearchInput] = useState<string>("");

  const handleInput = (e: any) => {
    const { value } = e.target;
    setTreeSearchInput(value);
    console.log("여긴 searchpage", value);
  };

  console.log(treeSearchInput);
  useEffect(() => {
    if (clickSearch) {
      fetchSearch(treeSearchInput);
      console.log("클릭했어?", treeSearchInput);
    }
  }, [clickSearch]);

  const [searchData, setSearchData] = useState<Tree[]>([]);
  // 검색 결과 가져오기
  const fetchSearch = async (name: string) => {
    console.log("name", decodeURI(name));
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/tree/${name}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${userToken}`,
        },
        mode: "cors",
      });
      if (response.status === 200) {
        console.log("왔니?");
        const responseData = await response.json();
        console.log(responseData);
        setSearchData(responseData.trees);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="mt-10 mx-5">
        <SearchBar name="search" value={treeSearchInput} handleInput={handleInput} handleSearch={handleSearch} />
        <div className="mt-7 w-full">
          <SearchContainer />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
