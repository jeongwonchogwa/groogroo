"use client";

import { useEffect, useState } from "react";
import { userInfoStore } from "@/stores/userInfoStore";
import { redirect, useRouter } from "next/navigation";
import Button from "@/app/components/Button";
import SearchTreeContainer from "./components/SearchTreeContainer";
import { searchTreeStore } from "@/stores/searchTreeInfo";
import SearchCreateFruits from "./components/SearchCreateFruits";
import PixelCard from "@/app/components/PixelCard";
import Image from "next/image";

const SearchTreePage = ({ params }: { params: { slug: string } }) => {
  // userToken 바꿔야 함
  const { userToken } = userInfoStore();
  useEffect(() => {
    if (userToken === "") redirect("/");
  }, [userToken]);

  // const userInfoString = sessionStorage.getItem("userInfo");

  const [createFruit, setCreateFruit] = useState<boolean>(false);
  const onFormCloseButtonClick = () => {
    setCreateFruit((prev) => !prev);
  };

  const { searchTreeInfoData } = searchTreeStore();
  const router = useRouter();

  return (
    <>
      <div className="w-full h-[calc(100%-60px)]">
        <div className="mx-5 mb-8">
          <SearchTreeContainer />
        </div>
        <div className="mx-9 pt-5">
          <Button color="secondary" label="열매 달러가기" onClick={onFormCloseButtonClick} />
        </div>
      </div>
      {createFruit && searchTreeInfoData && (
        <div
          className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-70 z-[60]"
          onClick={(e) => {
            onFormCloseButtonClick();
            e.stopPropagation();
          }}
        >
          <div className="flex flex-col items-center justify-center gap-2 pt-20">
            <PixelCard
              content={<div className="bg-white font-bitBit py-2 px-3 text-xl">{searchTreeInfoData.name}</div>}
            ></PixelCard>
            <Image alt="currentTree" src={searchTreeInfoData.imageUrl} width={250} height={200}></Image>
            <div className="px-3">
              <SearchCreateFruits onFormCloseButtonClick={onFormCloseButtonClick} currentTree={searchTreeInfoData} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchTreePage;
