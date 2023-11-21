"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { fetchWithTokenCheck } from "../components/FetchWithTokenCheck";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Garden } from "../types";
import useUserToken from "../hooks/useUserToken";
import { useRouter } from "next/navigation";
import GardensHeader from "./components/GardensHeader";
import GardenCard from "./components/GardenCard";
import Image from "next/image";
import LoadingGif from "/public/assets/gif/loading.gif";
import Button from "../components/Button";

const fetchGardenList = async (
  pageNumber: number,
  userToken: string,
  router: AppRouterInstance
) => {
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
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const responseData = await response.json();
    return responseData.gardenInfo.content;
  } catch (error) {
    console.error("Error fetching garden list:", error);
    return [];
  }
};

const fetchGardenRankingList = async (
  pageNumber: number,
  userToken: string,
  router: AppRouterInstance
) => {
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
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const responseData = await response.json();
    return responseData.ranking.content;
  } catch (error) {
    console.error("Error fetching garden list:", error);
    return [];
  }
};

const GardenComponent = () => {
  const userToken = useUserToken();
  const router = useRouter();
  const [sort, setSort] = useState("내 정원");
  const [loading, setLoading] = useState<boolean>(false);
  const [noMoreData, setNoMoreData] = useState<boolean>(false);
  const observer = useRef<IntersectionObserver>();
  const [loadingPageNumber, setLoadingPageNumber] = useState<number | null>(
    null
  );
  const [firstLoading, setFirstLoading] = useState<boolean>(false);

  const [gardenList, setGardenList] = useState<Garden[]>([]);
  const [gardenRanking, setGardenRanking] = useState<Garden[]>([]);

  const cancelRequestRef = useRef<boolean>(false);

  const [gardenListPageNumber, setGardenListPageNumber] = useState<number>(0);
  const [gardenRankingPageNumber, setGardenRankingPageNumber] =
    useState<number>(0);

  useEffect(() => {
    if (sort === "내 정원") {
      setGardenListPageNumber(0);
      setNoMoreData(false);
    } else if (sort === "정원 랭킹") {
      setGardenRankingPageNumber(0);
      setNoMoreData(false);
    }

    if (gardenCardRef.current) {
      gardenCardRef.current.scrollTop = 0;
    }

    setTimeout(() => {
      loadGardens(); // 첫 페이지 데이터 로드
    }, 0);
  }, [sort]);

  useEffect(() => {
    if (sort === "내 정원" && gardenListPageNumber > 0) {
      loadGardens();
    } else if (sort === "정원 랭킹" && gardenRankingPageNumber > 0) {
      loadGardens();
    }
  }, [gardenListPageNumber, gardenRankingPageNumber]);

  const lastGardenElementRef = useCallback(
    (node: Element | null) => {
      const currentPageNumber =
        sort === "내 정원" ? gardenListPageNumber : gardenRankingPageNumber;
      if (loading || noMoreData || firstLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          loadingPageNumber !== currentPageNumber
        ) {
          if (sort === "내 정원") {
            setGardenListPageNumber((prevPageNumber) => prevPageNumber + 1);
          } else if (sort === "정원 랭킹") {
            setGardenRankingPageNumber((prevPageNumber) => prevPageNumber + 1);
          }
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, noMoreData, firstLoading, sort]
  );

  const loadGardens = async () => {
    const currentPageNumber =
      sort === "내 정원" ? gardenListPageNumber : gardenRankingPageNumber;
    setLoadingPageNumber(currentPageNumber);

    if (currentPageNumber === 0) {
      setFirstLoading(true);
      setLoading(false); // 첫 페이지 로딩 시 loading 상태를 false로 설정
      if (sort === "내 정원") {
        setGardenList([]);
      } else if (sort === "정원 랭킹") {
        setGardenRanking([]);
      }
    } else {
      setFirstLoading(false);
      setLoading(true); // 추가 페이지 로딩 시 firstLoading 상태를 false로 설정
    }

    try {
      if (sort === "내 정원") {
        const newGardens = await fetchGardenList(
          currentPageNumber,
          userToken,
          router
        );
        setGardenList((current) =>
          currentPageNumber === 0 ? newGardens : [...current, ...newGardens]
        );
        setNoMoreData(newGardens.length === 0);
      } else if (sort === "정원 랭킹") {
        const newGardens = await fetchGardenRankingList(
          currentPageNumber,
          userToken,
          router
        );
        setGardenRanking((current) =>
          currentPageNumber === 0 ? newGardens : [...current, ...newGardens]
        );
        setNoMoreData(newGardens.length === 0);
      }
    } catch (error) {
      console.error("Error in loadGardens:", error);
      setNoMoreData(true);
    } finally {
      if (!cancelRequestRef.current) {
        setFirstLoading(false);
        setLoading(false);
      }
      setLoadingPageNumber(null);
    }
  };

  const gardenCardRef = useRef<HTMLDivElement | null>(null);

  const clickText = (e: any) => {
    const newSort = e.target.innerText;
    setSort(newSort);
  };

  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const handlemenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className="min-w-[350px] max-w-[450px] mx-auto h-screen bg-background-pixel bg-blend-overlay bg-slate-300 bg-opacity-25 bg-cover">
      <GardensHeader
        clickText={clickText}
        handlemenu={() => handlemenu()}
        menuOpen={menuOpen}
      />
      <div className="mt-[30px] mx-5">
        <div className="grid grid-flow-col gap-2">
          <Button
            color={sort === "내 정원" ? "primary" : "default"}
            label="내 정원"
            onClickText={clickText}
          />
          <Button
            color={sort === "정원 랭킹" ? "primary" : "default"}
            label="정원 랭킹"
            onClickText={clickText}
          />
        </div>
      </div>
      <div
        className="h-[calc(100%-180px)] overflow-scroll mt-3"
        ref={gardenCardRef}
      >
        {firstLoading && (
          <div className="h-full w-full flex flex-col justify-center">
            <div className="flex justify-center">
              <Image alt="로딩중" src={LoadingGif} width={100} height={60} />
            </div>
            <p className="text-center font-bitBit text-2xl mt-3 text-white">
              {sort}을 가져오는 중입니다
              <br /> 잠시만 기다려주세요
            </p>
          </div>
        )}
        <div className="flex w-full flex-col">
          {sort === "내 정원"
            ? gardenList.map((garden, index) => {
                if (gardenList.length === index + 1) {
                  return (
                    <div
                      className="mt-5 w-full flex justify-center"
                      ref={lastGardenElementRef}
                      key={index}
                    >
                      <GardenCard garden={garden} sort={sort} index={index} />
                    </div>
                  );
                } else {
                  return (
                    <div
                      className="mt-5 w-full flex justify-center"
                      key={index}
                    >
                      <GardenCard garden={garden} sort={sort} index={index} />
                    </div>
                  );
                }
              })
            : gardenRanking.map((garden, index) => {
                if (gardenRanking.length === index + 1) {
                  return (
                    <div
                      className="mt-5 w-full flex justify-center"
                      ref={lastGardenElementRef}
                      key={index}
                    >
                      <GardenCard garden={garden} sort={sort} index={index} />
                    </div>
                  );
                } else {
                  return (
                    <div
                      className="mt-5 w-full flex justify-center"
                      key={index}
                    >
                      <GardenCard garden={garden} sort={sort} index={index} />
                    </div>
                  );
                }
              })}
          {loading && (
            <div className="my-4 w-full flex justify-center">
              <Image alt="로딩중" src={LoadingGif} width={100} height={60} />
            </div>
          )}
        </div>
        {!loading && noMoreData && gardenList.length === 0 && (
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

export default GardenComponent;
