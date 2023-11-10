"use client";

import { useEffect } from "react";
import { userInfoStore } from "@/stores/userInfoStore";
import { redirect } from "next/navigation";
import SearchTreeSection from "./components/SearchTreeSection";
import SearchFruitMessageContainer from "./components/SearchFruitMessageContainer";

const SearchTreeFruitsPage = ({ params }: { params: { slug: string } }) => {
  // userToken을 이렇게 받으면 안됩니다.
  const { userToken } = userInfoStore();
  useEffect(() => {
    if (userToken === "") redirect("/");
  }, [userToken]);

  return (
    <div className="w-full h-[100%-60px]">
      <div className="mx-5 my-8">
        <SearchTreeSection />
      </div>
      <div className="mx-4 my-4 h-full">
        <SearchFruitMessageContainer />
      </div>
    </div>
  );
};
export default SearchTreeFruitsPage;
