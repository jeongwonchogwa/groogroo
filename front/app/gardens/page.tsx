"use client";

import GardensHeader from "./components/GardensHeader";
import GardenCard from "./components/GardenCard";

import { Garden } from "../types";
import { useState, useEffect, useCallback, useRef } from "react";
import { redirect } from "next/navigation";
import { userInfoStore } from "@/stores/userInfoStore";

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
  const [noDataMessage, setNoDataMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const loader = useRef(null);

  const [sort, setSort] = useState<string>("내 정원");

  // GardenCard의 스크롤을 조작하기 위한 ref
  const gardenCardRef = useRef<HTMLDivElement | null>(null);

  // sort가 변경될 때마다 GardenCard의 스크롤을 맨 위로 이동
  useEffect(() => {
    if (gardenCardRef.current) {
      gardenCardRef.current.scrollTop = 0;
    }
  }, [sort]);

  const clickText = (e: any) => {
    const newSort = e.target.innerText;
    setSort(newSort);
  };

  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const handlemenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // 내 정원 GardenList 불러오기

  const fetchGardenList = useCallback(
    async (pageNumber: number) => {
      console.log(pageNumber);
      setLoading(true);
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
          setHasNext(true);
        } else if (response.status === 500) {
          setNoDataMessage("데이터가 없습니다.");
          setHasNext(false);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    },
    [userToken]
  );

  const fetchGardenRankingList = useCallback(
    async (pageNumber: number) => {
      setLoading(true);
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
          setHasNext(true);
        } else if (response.status === 500) {
          setNoDataMessage("데이터가 없습니다.");
          setHasNext(false);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    },
    [userToken]
  );

  useEffect(() => {
    if (window) {
      const handleScroll = () => {
        // 사용자가 페이지 하단에 도달했는지 확인
        if (
          window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight
        ) {
          // hasNext 상태를 확인하여 더 불러올 데이터가 있는지 확인
          if (hasNext) {
            setPageNumber((prev) => prev + 1);
          }
        }
      };

      // 스크롤 이벤트 리스너 추가
      window.addEventListener("scroll", handleScroll);

      // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [hasNext]);

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
      <div className="h-[650px] overflow-scroll mt-3" ref={gardenCardRef}>
        <div className="flex w-full flex-col">
          <GardenCard sort={sort} gardenList={gardenList} />
          {/* <div ref={loader}>Loading more...</div>
          {noDataMessage && <div>{noDataMessage}</div>} */}
        </div>
      </div>
    </div>
  );
};

export default GardensPage;
