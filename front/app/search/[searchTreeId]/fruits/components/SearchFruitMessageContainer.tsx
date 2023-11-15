"use client";

import IconButton from "@/app/components/IconButton";
import MessageContainer from "@/app/components/MessageContainer";
import { Fruit } from "@/app/types";
import { searchTreeStore } from "@/stores/searchTreeInfo";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  data: Fruit[];
}
const SearchFruitMessageContainer = ({ data }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextFruits = () => {
    if (data) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    }
  };

  const prevFruits = () => {
    if (data) {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + data.length) % data.length
      );
    }
  };

  const [availableDelete, setAvailableDelete] = useState<boolean>(false);

  useEffect(() => {
    if (data && data[currentIndex].createTime.includes(":")) {
      const [createTimeHours, createTimeMinutes] =
        data[currentIndex].createTime.split(":");
      const currentTime = new Date();
      const currentHours = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();

      const timeDifference =
        currentHours * 60 +
        currentMinutes -
        (Number(createTimeHours) * 60 + Number(createTimeMinutes));

      console.log(timeDifference);
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
      {data && data.length > 0 ? (
        <div className="w-full flex flex-col">
          <div className="w-full flex flex-row">
            <div className="w-7 my-auto">
              {data.length > 0 && (
                <IconButton iconSrc="arrow" onClick={prevFruits} />
              )}
            </div>
            {/* h를 박아 넣는게 맞나...? */}
            <div className="w-full h-[300px] mr-3 ml-1">
              <MessageContainer
                dataType="FRUIT"
                availableDelete={availableDelete}
                isSearch={true}
                currentIndex={currentIndex} // 현재 열매가 Fruits 배열에서 어디 인덱스에 위치했는지 확인
                data={data[currentIndex]} // 전체 열매 데이터
              />
            </div>
            <div className="w-7 my-auto">
              {data.length > 0 && (
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
