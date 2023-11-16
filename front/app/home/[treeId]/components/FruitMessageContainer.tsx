"use client";

import IconButton from "@/app/components/IconButton";
import MessageContainer from "@/app/components/MessageContainer";
import { useState } from "react";
import { Fruit } from "@/app/types";
import Image from "next/image";

interface Props {
  fruits: Fruit[];
}

const FruitMessageContainer = ({ fruits }: Props) => {
  // 현재 열매 데이터가 `Fruits의 어느 위치에 있니?
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextFruits = () => {
    if (fruits) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % fruits.length);
    }
  };

  const prevFruits = () => {
    if (fruits) {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + fruits.length) % fruits.length
      );
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-row">
        <div className="w-7 my-auto">
          {fruits.length > 0 && (
            <IconButton iconSrc="arrow" onClick={prevFruits} />
          )}
        </div>
        {fruits.length > 0 ? (
          <div className="w-full h-[300px] mr-3 ml-1">
            <MessageContainer
              dataType="FRUIT"
              currentIndex={currentIndex} // 현재 열매가 Fruits 배열에서 어디 인덱스에 위치했는지 확인
              data={fruits[currentIndex]} // 특정 열매 데이터
            />
          </div>
        ) : (
          <div className="nes-container is-rounded bg-white w-full h-[300px]">
            <div className="flex flex-col justify-center h-full items-center">
              <Image
                alt="empty"
                src="/assets/images/question.svg"
                width={73}
                height={99}
              />
              <p className="mt-5 font-neoDunggeunmo_Pro text-xl">
                열매가 없습니다!
              </p>
            </div>
          </div>
        )}
        <div className="w-7 my-auto">
          {fruits.length > 0 && (
            <IconButton iconSrc="arrow" rotate={true} onClick={nextFruits} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FruitMessageContainer;
