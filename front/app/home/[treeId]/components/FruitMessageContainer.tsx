"use client";

import IconButton from "@/app/components/IconButton";
import MessageContainer from "@/app/components/MessageContainer";
import { userTreeStore } from "@/stores/userTreeStore";
import { useState, useEffect } from "react";
import { userInfoStore } from "@/stores/userInfoStore";

const FruitMessageContainer = () => {
  const { userTree, setUserTree } = userTreeStore();

  const data = userTree?.fruits;

  // 현재 열매 데이터가 `Fruits의 어느 위치에 있니?
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextFruits = () => {
    if (data) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    }
  };

  const prevFruits = () => {
    if (data) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
    }
  };

  return (
    <>
      {data && (
        <div className="w-full flex flex-col">
          <div className="w-full flex flex-row">
            <div className="w-7 my-auto">{data.length > 0 && <IconButton iconSrc="arrow" onClick={prevFruits} />}</div>
            {data.length > 0 ? (
              <div className="w-full h-[350px] mr-3 ml-1">
                <MessageContainer
                  dataType="FRUIT"
                  currentIndex={currentIndex} // 현재 열매가 Fruits 배열에서 어디 인덱스에 위치했는지 확인
                  data={data[currentIndex]} // 특정 열매 데이터
                />
              </div>
            ) : (
              <div>데이터가 없어요</div>
            )}
            <div className="w-7 my-auto">
              {data.length > 0 && <IconButton iconSrc="arrow" rotate={true} onClick={nextFruits} />}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FruitMessageContainer;
