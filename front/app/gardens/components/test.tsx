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
  const [loading, setLoading] = useState<boolean>(false); // 로딩 상태
  const [hasMore, setHasMore] = useState<boolean>(true); // 데이터가 더 있는지 여부

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
          setHasMore(true);
          setLoading(false);
        } else if (response.status === 500) {
          setHasMore(false);
          setLoading(false);
        }
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
          setHasMore(true);
          setLoading(false);
        } else if (response.status === 500) {
          setHasMore(false);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [userToken]
  );

  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || !hasMore) return console.log("다시 돌아강");
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const observerInstance = observer.current;
    return () => {
      // 컴포넌트가 언마운트될 때 observer를 정리합니다
      if (observerInstance) {
        observerInstance.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    setPageNumber(0); // sort가 변경될 때만 pageNumber를 0으로 리셋
  }, [sort]);

  useEffect(() => {
    if (sort === "내 정원") {
      fetchGardenList(pageNumber);
    } else {
      fetchGardenRankingList(pageNumber);
    }
  }, [fetchGardenList, fetchGardenRankingList, pageNumber]);

  return (
    <div
      className="min-w-[350px] max-w-[450px] bg-background-pixel bg-blend-overlay bg-slate-300 bg-opacity-25 bg-cover"
      id="custom-full-height"
    >
      {/* <div className="w-screen h-screen bg-background-pixel bg-blend-overlay bg-slate-300 bg-opacity-25 bg-cover"> */}
      <GardensHeader
        clickText={clickText}
        handlemenu={() => handlemenu()}
        menuOpen={menuOpen}
      />

      <div className="h-[650px] overflow-scroll mt-3">
        {gardenList.length > 0 && (
          <div className="flex w-full flex-col" ref={lastElementRef}>
            <GardenCard sort={sort} gardenList={gardenList} />{" "}
          </div>
        )}

        {loading && <p>로딩중입니다.</p>}
        {!hasMore && <p>데이터가 없습니다.</p>}

        {/* <div ref={loader}>Loading more...</div>
          {noDataMessage && <div>{noDataMessage}</div>} */}
      </div>
    </div>
  );
};

export default GardensPage;
