"use client";

import { fetchWithTokenCheck } from "@/app/components/FetchWithTokenCheck";
import IconButton from "@/app/components/IconButton";
import MessageContainer from "@/app/components/MessageContainer";
import useSearchTree from "@/app/hooks/useSearchTree";
import useUserToken from "@/app/hooks/useUserToken";
import { Fruit } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  searchTreeId: number;
}
const SearchFruitMessageContainer = ({ searchTreeId }: Props) => {
  const userToken = useUserToken();
  const { treeId, loading, error } = useSearchTree(userToken);

  useEffect(() => {
    if (!loading && !error && treeId === null) {
      redirect("/enter/terms");
    }
  }, [loading, error, treeId]);

  const router = useRouter();

  const fetchSearch = async () => {
    try {
      const response = await fetchWithTokenCheck(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/tree/detail/${searchTreeId}`,
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

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextFruits = () => {
    if (data.fruits) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.fruits.length);
    }
  };

  const prevFruits = () => {
    if (data.fruits) {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + data.fruits.length) % data.fruits.length
      );
    }
  };

  const [availableDelete, setAvailableDelete] = useState<boolean>(false);

  useEffect(() => {
    if (
      data.fruits.length > 0 &&
      data.fruits[currentIndex].createTime.includes(":")
    ) {
      const [createTimeHours, createTimeMinutes] =
        data.fruits[currentIndex].createTime.split(":");
      const currentTime = new Date();
      const currentHours = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();

      const timeDifference =
        currentHours * 60 +
        currentMinutes -
        (Number(createTimeHours) * 60 + Number(createTimeMinutes));

      if (timeDifference < 6) {
        setAvailableDelete(true);
      } else {
        setAvailableDelete(false);
      }
    } else {
      setAvailableDelete(false);
    }
  }, [data, currentIndex]);

  return (
    <>
      {data.fruits && data.fruits.length > 0 ? (
        <div className="w-full flex flex-col">
          <div className="w-full flex flex-row">
            <div className="w-7 my-auto">
              {data.fruits.length > 0 && (
                <IconButton iconSrc="arrow" onClick={prevFruits} />
              )}
            </div>
            <div className="w-full h-[300px] mr-3 ml-1">
              <MessageContainer
                dataType="FRUIT"
                availableDelete={availableDelete}
                isSearch={true}
                currentIndex={currentIndex} // 현재 열매가 Fruits 배열에서 어디 인덱스에 위치했는지 확인
                data={data.fruits[currentIndex]} // 전체 열매 데이터
              />
            </div>
            <div className="w-7 my-auto">
              {data.fruits.length > 0 && (
                <IconButton
                  iconSrc="arrow"
                  rotate={true}
                  onClick={nextFruits}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex justify-center">
          <div className="nes-container is-rounded w-full bg-white flex flex-col">
            <div className="w-full flex justify-center mt-3">
              <Image
                alt="no_data"
                src="/assets/images/no_data.svg"
                width={150}
                height={350}
              />
            </div>
            <p className="w-full flex justify-center mt-3 font-neoDunggeunmo_Pro text-lg ">
              새로운 열매를 달아주세요!
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchFruitMessageContainer;
