"use client";

import GardensHeader from "./components/GardensHeader";
import GardenCard from "./components/GardenCard";

import { Garden } from "../types";
import { useState, useEffect, useCallback, useRef } from "react";
import { redirect, useRouter } from "next/navigation";
import useUserToken from "../hooks/useUserToken";
import useSearchTree from "../hooks/useSearchTree";
import { fetchWithTokenCheck } from "../components/FetchWithTokenCheck";

// 리팩토링 필요

const GardensPage = () => {
  const userToken = useUserToken();
  const { treeId, loading, error } = useSearchTree(userToken);

  useEffect(() => {
    if (!loading && !error && treeId === null) {
      redirect("/enter/terms");
    }
  }, [loading, error, treeId]);

  const [myGardenList, setMyGardenList] = useState<Garden[]>([]);
  const [rankingGardenList, setRankingGardenList] = useState<Garden[]>([]);

  const [myGardenPageNumber, setMyGardenPageNumber] = useState<number>(0);
  const [rankingGardenPageNumber, setRankingGardenPageNumber] =
    useState<number>(0);
  const [Nowloading, setNowLoading] = useState<boolean>(false);
  const [hasMyGardenNext, setHasMyGardenNext] = useState<boolean>(true);
  const [hasRankingGardenNext, setHasRankingGardenNext] =
    useState<boolean>(true);
  const loader = useRef<HTMLDivElement>(null);

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
  const router = useRouter();
  const fetchGardenList = useCallback(
    async (pageNumber: number) => {
      setNowLoading(true);
      console.log("이건 fetchGardenList", pageNumber);
      try {
        const response = await fetchWithTokenCheck(
          `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/garden/list/${pageNumber}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          },
          router
        );
        if (response.status === 200) {
          const responseData = await response.json();
          console.log(`${pageNumber}의`, responseData);
          setMyGardenList((prev: any) => [
            ...prev,
            ...responseData.gardenInfo.content,
          ]);
          if (
            responseData.gardenInfo.totalElememts < responseData.gardenInfo.size
          ) {
            setHasMyGardenNext(true);
          } else {
            setHasMyGardenNext(false);
          }
        } else if (response.status === 500) {
          setHasMyGardenNext(false);
        }
        setNowLoading(false);
      } catch (error) {
        console.log(error);
      }
    },
    [userToken]
  );

  const fetchGardenRankingList = useCallback(
    async (pageNumber: number) => {
      console.log("여기는 fetchGardenRanking 들어왔니?");

      setNowLoading(true);
      try {
        const response = await fetchWithTokenCheck(
          `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/garden/like/ranking/${pageNumber}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          },
          router
        );
        if (response.status === 200) {
          const responseData = await response.json();
          console.log(`${pageNumber}의`, responseData);
          setRankingGardenList((prev: any) => [
            ...prev,
            ...responseData.ranking.content,
          ]);

          if (responseData.ranking.totalElememts < responseData.ranking.size) {
            setHasRankingGardenNext(true);
          } else {
            setHasRankingGardenNext(false);
          }
        } else if (response.status === 500) {
          setHasRankingGardenNext(false);
        }
        setNowLoading(false);
      } catch (error) {
        console.log(error);
      }
    },
    [userToken]
  );

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (sort === "내 정원") {
        if (entries[0].isIntersecting && hasMyGardenNext && !Nowloading) {
          setMyGardenPageNumber((prevPage) => prevPage + 1);
        } else {
          if (
            entries[0].isIntersecting &&
            hasRankingGardenNext &&
            !Nowloading
          ) {
            setRankingGardenPageNumber((prevPage) => prevPage + 1);
          }
        }
      }
    });

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loader, hasMyGardenNext, hasRankingGardenNext, Nowloading, sort]);

  useEffect(() => {
    if (userToken) {
      if (sort === "내 정원") {
        if (hasMyGardenNext) {
          fetchGardenList(myGardenPageNumber);
        }
      } else {
        if (hasRankingGardenNext) {
          fetchGardenRankingList(rankingGardenPageNumber);
        }
      }
    }
  }, [
    fetchGardenList,
    fetchGardenRankingList,
    sort,
    myGardenPageNumber,
    rankingGardenPageNumber,
    hasMyGardenNext,
    hasRankingGardenNext,
    userToken,
  ]);

  return (
    <div className="w-screen h-screen bg-background-pixel bg-blend-overlay bg-slate-300 bg-opacity-25 bg-cover">
      <GardensHeader
        clickText={clickText}
        handlemenu={() => handlemenu()}
        menuOpen={menuOpen}
      />
      <div className="h-[650px] overflow-scroll mt-3" ref={gardenCardRef}>
        <div className="flex w-full flex-col">
          <GardenCard
            sort={sort}
            gardenList={sort === "내 정원" ? myGardenList : rankingGardenList}
          />
          {Nowloading && <p>Loading...</p>}
          {/* {!hasNext && <p>마지막 데이터 입니다.</p>} */}
          <div ref={loader} />
        </div>
      </div>
    </div>
  );
};

export default GardensPage;
