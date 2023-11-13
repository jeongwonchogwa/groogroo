"use client";

import GardensHeader from "./components/GardensHeader";
import GardenCard from "./components/GardenCard";

import { Garden } from "../types";
import { useState, useEffect, useCallback } from "react";
import { redirect } from "next/navigation";
import { userInfoStore } from "@/stores/userInfoStore";

//userToken은 local에서 꺼내와야함

const GardensPage = () => {
  // let userToken = "";
  // useEffect(() => {
  //   if (window) {
  //     const localstorageData = localStorage.getItem("userInfo");

  //     if (localstorageData) {
  //       const localStorageObject = JSON.parse(localstorageData);
  //       userToken = localStorageObject?.state?.userToken;
  //       if (userToken) {
  //         console.log(userToken);
  //       } else {
  //         console.log("userToken이 존재하지 않습니다.");
  //         redirect("/enter");
  //       }
  //     }
  //   }
  // }, []);

  const { userToken } = userInfoStore();

  useEffect(() => {
    // 경로 수정 필요
    if (userToken === "") redirect("/enter");
  }, [userToken]);

  const [gardenList, setGardenList] = useState<Garden[]>([]);

  const [pageNumber, setPageNumber] = useState<number>(0);

  const [sort, setSort] = useState<string>("내 정원");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    console.log(sort);
  }, [sort]);

  console.log("무한?");
  const clickText = (e: any) => {
    const newSort = e.target.innerText;
    setSort(newSort);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const handlemenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // 내 정원 GardenList 불러오기

  const fetchGardenList = useCallback(
    async (pageNumber: number) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/garden/list/${pageNumber}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        if (response.status === 200) {
          const responseData = await response.json();
          setGardenList(responseData.gardenInfo.content);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [userToken]
  );

  const fetchGardenRankingList = useCallback(
    async (pageNumber: number) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/garden/like/ranking/${pageNumber}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        if (response.status === 200) {
          const responseData = await response.json();
          setGardenList(responseData.ranking);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [userToken]
  );

  // todo. 스크롤 맨 위로 올리는 코드가 필요
  useEffect(() => {
    if (sort === "내 정원") {
      fetchGardenList(pageNumber);
    } else {
      fetchGardenRankingList(pageNumber);
    }
  }, [fetchGardenList, fetchGardenRankingList, sort, pageNumber]);

  return (
    <div className="w-screen h-screen bg-background-pixel bg-blend-overlay bg-slate-300 bg-opacity-25 bg-cover">
      <GardensHeader
        clickText={clickText}
        handlemenu={() => handlemenu()}
        menuOpen={menuOpen}
      />
      {/* h는 뭐로 줘야 */}
      <div className="h-[650px] overflow-scroll mt-3">
        <div className="flex w-full flex-col">
          <GardenCard sort={sort} gardenList={gardenList} />
        </div>
      </div>
    </div>
  );
};

export default GardensPage;
