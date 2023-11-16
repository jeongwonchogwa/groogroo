"use client";

import { useEffect, useState } from "react";
import { userInfoStore } from "@/stores/userInfoStore";
import { redirect, useRouter } from "next/navigation";
import Button from "@/app/components/Button";
import SearchTreeContainer from "./components/SearchTreeContainer";
import SearchCreateFruits from "./components/SearchCreateFruits";
import PixelCard from "@/app/components/PixelCard";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/components/Loading";
import useUserToken from "@/app/hooks/useUserToken";
import useSearchTree from "@/app/hooks/useSearchTree";
import { fetchWithTokenCheck } from "@/app/components/FetchWithTokenCheck";

const SearchTreePage = ({ params }: { params: { searchTreeId: number } }) => {
  const userToken = useUserToken();
  const { treeId, loading, error } = useSearchTree(userToken);

  useEffect(() => {
    if (!loading && !error && treeId === null) {
      redirect("/enter/terms");
    }
  }, [loading, error, treeId]);

  const [createFruit, setCreateFruit] = useState<boolean>(false);

  const onFormCloseButtonClick = () => {
    setCreateFruit((prev) => !prev);
  };

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
    <>
      <div className="w-full h-[calc(100%-60px)]">
        <div className="mx-5 mb-8">
          <SearchTreeContainer searchData={data} />
        </div>
        <div className="mx-9">
          <Button
            color="secondary"
            label="열매 달러가기"
            onClick={onFormCloseButtonClick}
          />
        </div>
      </div>
      {/* 열매 달기 모달 */}
      {createFruit && (
        <div
          className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-70 z-[60]"
          onClick={(e) => {
            onFormCloseButtonClick();
            e.stopPropagation();
          }}
        >
          <div className="flex flex-col items-center justify-center gap-2 pt-10">
            <PixelCard
              content={
                <div className="bg-white font-bitBit py-2 px-3 text-xl">
                  {data.name}
                </div>
              }
            ></PixelCard>
            <Image
              alt="currentTree"
              src={data.imageUrl}
              width={250}
              height={200}
            />

            <div className="px-3">
              <SearchCreateFruits
                onFormCloseButtonClick={onFormCloseButtonClick}
                currentTree={data}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchTreePage;
