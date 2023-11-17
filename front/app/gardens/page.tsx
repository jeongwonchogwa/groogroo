"use client";

import GardensHeader from "./components/GardensHeader";
import GardenCard from "./components/GardenCard";

import { Garden } from "../types";
import { useState, useEffect, useCallback, useRef } from "react";
import { redirect, useRouter } from "next/navigation";
import useUserToken from "../hooks/useUserToken";
import useSearchTree from "../hooks/useSearchTree";
import { fetchWithTokenCheck } from "../components/FetchWithTokenCheck";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import Loading from "../components/Loading";

// 리팩토링 필요

const GardensPage = () => {
  const userToken = useUserToken();
  const queryClient = useQueryClient();
  const { treeId, loading, error } = useSearchTree(userToken);

  useEffect(() => {
    if (!loading && !error && treeId === null) {
      redirect("/enter/terms");
    }
  }, [loading, error, treeId]);

  useEffect(() => {
    queryClient.removeQueries({ queryKey: ["getGardenInfo"] });
  }, []);

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
      if (pageNumber === 0) {
        setFirstLoading(true);
      } else {
        setNowLoading(true);
      }
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
          if (pageNumber === 0) {
            setMyGardenList(responseData.gardenInfo.content);
            setFirstLoading(false);
          } else {
            setMyGardenList((prev: any) => [
              ...prev,
              ...responseData.gardenInfo.content,
            ]);
          }
          setHasRankingGardenNext(
            pageNumber < responseData.gardenInfo.totalPages
          );
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

  const [firstLoading, setFirstLoading] = useState<boolean>(false);
  const fetchGardenRankingList = useCallback(
    async (pageNumber: number) => {
      if (pageNumber === 0) {
        setFirstLoading(true);
      } else {
        setNowLoading(true);
      }
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
          if (pageNumber === 0) {
            setRankingGardenList(responseData.ranking.content);
            setFirstLoading(false);
          } else {
            setRankingGardenList((prev: any) => [
              ...prev,
              ...responseData.ranking.content,
            ]);
          }
          setHasRankingGardenNext(pageNumber < responseData.ranking.totalPages);
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
        if (
          entries[0].isIntersecting &&
          hasMyGardenNext &&
          !Nowloading &&
          !firstLoading
        ) {
          setMyGardenPageNumber((prevPage) => prevPage + 1);
        }
      } else {
        if (
          entries[0].isIntersecting &&
          hasRankingGardenNext &&
          !Nowloading &&
          !firstLoading
        ) {
          setRankingGardenPageNumber((prevPage) => prevPage + 1);
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
  }, [
    loader,
    hasMyGardenNext,
    hasRankingGardenNext,
    Nowloading,
    sort,
    firstLoading,
  ]);
  useEffect(() => {
    if (userToken) {
      fetchGardenList(myGardenPageNumber);
      fetchGardenRankingList(rankingGardenPageNumber);
    }
  }, [userToken, fetchGardenList, fetchGardenRankingList]);

  useEffect(() => {
    if (userToken) {
      if (sort === "내 정원") {
        if (!Nowloading && hasMyGardenNext) {
          console.log(myGardenPageNumber);
          fetchGardenList(myGardenPageNumber);
        }
      } else {
        if (!Nowloading && hasRankingGardenNext) {
          console.log(rankingGardenPageNumber);
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
        {sort === "내 정원" && myGardenList.length > 0 ? (
          <div className="flex w-full flex-col">
            <GardenCard
              sort={sort}
              // gardenList={sort === "내 정원" ? myGardenList : rankingGardenList}
              gardenList={myGardenList}
            />
            {Nowloading && (
              <div className="mt-3 w-full flex justify-center">
                <Image
                  alt="로딩중"
                  src="/assets/gif/loading.gif"
                  width={100}
                  height={60}
                />
              </div>
            )}
            <div ref={loader} />
          </div>
        ) : sort === "정원 랭킹" && rankingGardenList.length > 0 ? (
          <div className="h-[650px] overflow-scroll mt-3" ref={gardenCardRef}>
            <div className="flex w-full flex-col">
              <GardenCard sort={sort} gardenList={rankingGardenList} />
              {Nowloading && (
                <div className="mt-3 w-full flex justify-center">
                  <Image
                    alt="로딩중"
                    src="/assets/gif/loading.gif"
                    width={100}
                    height={60}
                  />
                </div>
              )}
              <div ref={loader} />
            </div>
          </div>
        ) : firstLoading ? (
          <div className="h-full w-full flex flex-col justify-center">
            <div className="flex justify-center">
              <Image
                alt="로딩중"
                src="/assets/gif/loading.gif"
                width={100}
                height={60}
              />
            </div>
            <p className="text-center font-bitBit text-2xl mt-3 text-white">
              정원 목록을 가져오는 중입니다
              <br /> 잠시만 기다려주세요
            </p>
          </div>
        ) : (
          <div className="h-full w-full flex flex-col justify-center">
            <div className="flex justify-center">
              <Image
                alt="no_data"
                src="/assets/images/no_data.svg"
                width={150}
                height={350}
              />
            </div>
            <p className="w-full flex justify-center mt-3 font-neoDunggeunmo_Pro text-2xl text-white">
              정원 정보가 없습니다!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GardensPage;
