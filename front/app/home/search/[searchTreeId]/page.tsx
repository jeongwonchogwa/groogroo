"use client";

import { useEffect } from "react";
import { userInfoStore } from "@/stores/userInfoStore";
import { redirect } from "next/navigation";
import SearchFruitMessageContainer from "./components/SearchFruitMessageContainer";
import SearchTreeSection from "./components/SearchTreeSection";

const SearchTreePage = ({ params }: { params: { slug: string } }) => {
  const { userToken } = userInfoStore();
  useEffect(() => {
    if (userToken === "") redirect("/");
  }, [userToken]);

  return (
    <div className="w-full">
      <div className="mx-5 my-8">
        <SearchTreeSection />
      </div>
      <div className="mx-4">
        <SearchFruitMessageContainer />
      </div>
    </div>
  );
};
export default SearchTreePage;
