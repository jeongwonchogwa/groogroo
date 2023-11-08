"use client";

import GardensHeader from "./components/GardensHeader";
import GardenCard from "./components/GardenCard";

import { Garden } from "../types";
import { useState, useEffect, useCallback } from "react";
import { userInfoStore } from "@/stores/userInfoStore";
import { redirect } from "next/navigation";

const GardensPage = () => {
  const { userToken } = userInfoStore();

  const [gardenList, setGardenList] = useState<Garden[]>([]);

  const [selectedGardenId, setSelectedGardenId] = useState<number>(0);

  const [pageNumber, setPageNumber] = useState<number>(0);

  const [gardenData, setGardenData] = useState<Garden>({
    gardenId: 0,
    capacity: 0,
    name: "",
    description: "",
    imageUrl: "",
    state: null,
    likes: 0,
    memberCnt: 0,
  });

  const [sort, setSort] = useState<string>("내 정원");

  const clickText = (e: any) => {
    const newSort = e.target.innerText;
    setSort(newSort);
  };

  // 이거 숫자로 구분하고 하나로 처리할지말지 고민.
  const [open, setOpen] = useState<boolean>(false);

  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const handlemenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleToggle = (gardenId: number) => {
    setOpen((prevOpen) => !prevOpen);
    // 이거는 모달떄문에 필요한건가?
    setSelectedGardenId(gardenId);
    updateGardenData(gardenId);
  };

  // gardenData를 업데이트하는 함수
  const updateGardenData = (gardenId: number) => {
    const selectedGarden = gardenList.find(
      (garden) => garden.gardenId === gardenId
    );
    if (selectedGarden) {
      setGardenData(selectedGarden);
    }
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
          console.log(responseData);
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
          console.log(responseData);
        }
      } catch (error) {
        console.log("오류오류");
      }
    },
    [userToken]
  );

  useEffect(() => {
    if (userToken === "") redirect("/");
  }, [userToken]);

  useEffect(() => {
    if (sort === "내 정원") {
      fetchGardenList(pageNumber);
    } else {
      fetchGardenRankingList(pageNumber);
    }
  }, [fetchGardenList, fetchGardenRankingList, sort, pageNumber]);

  // 캐싱을 추가해야지?
  return (
    <div className="w-screen h-screen bg-background-pixel bg-blend-overlay bg-slate-300 bg-opacity-25 bg-cover">
      <GardensHeader
        clickText={clickText}
        handlemenu={() => handlemenu()}
        menuOpen={menuOpen}
      />
      <div className="h-[650px] overflow-scroll mt-3">
        <div className="flex w-full flex-col">
          <GardenCard
            selectedGardenId={selectedGardenId}
            gardenList={gardenList}
            gardenData={gardenData}
            handleToggle={handleToggle}
            open={open}
          />
        </div>
      </div>
    </div>
  );
};

export default GardensPage;
