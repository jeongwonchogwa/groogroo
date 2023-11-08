"use client";

import Button from "@/app/components/Button";
import UpdateContainer from "./components/updateContainer";
import UpdateTreeSection from "./components/updateTreeSection";
import { useEffect, useState } from "react";

const UpdatePage = () => {
  const [width, setWidth] = useState<number>(0);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    } else {
      setWidth(window.innerWidth);
    }
  }, []);

  const [openNext, setOpenNext] = useState<boolean>(false);

  const handleNext = () => {
    setOpenNext((prev) => !prev);
  };

  const [newName, setNewName] = useState<string>("");

  // 0 => 나무 input 클릭 | 1 => 유효성 실패 | 2 => 유효성 성공 중복확인 실패 | 3 => 유효성 성공 중복확인 성공
  const [checkTree, setCheckTree] = useState<number>(0);

  // 나무 인풋 클릭 여부 확인
  const handleInput = (e: any) => {
    const value = e.target.value;
    setNewName(value);
    setCheckTree(0);
  };

  // 나무 이름 중복확인
  const fetchTreeCheck = () => {
    const isValid = /^[가-힣A-Za-z0-9\s]+$/.test(newName);
    if (!isValid) {
      setCheckTree(1);
    } else {
      if ("중복확인 성공") {
        setCheckTree(3);
      } else {
        setCheckTree(2);
      }
    }
  };

  // 변경하기 클릭시 checkTree가 3이 된 상태여야 함 그게 아니면 돌려보내야해
  // 여기서 변경된 이름과 변경된 프리셋을 back으로 넘겨야함
  console.log("page newName", newName);

  // data는 back에서 가져와야해 back의 ㄹㄷㅅ초
  const data = [
    `/assets/trees/tree[0].svg`,
    "/assets/trees/tree[1].svg",
    "/assets/trees/tree[2].svg",
    "/assets/trees/tree[3].svg",
    "/assets/trees/tree[4].svg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
  };

  console.log(currentIndex);
  return (
    // 높이는 계속 박아넣고 있어요 -> calc로 변경
    <div className="w-full h-[calc(100%-60px)]">
      <div className="flex flex-col">
        <div className="mt-12 mb-7 mx-9">
          <Button color="white" label="나무 바꾸기" active={false} />
        </div>
        <div className="mt-3 h-[400px]">
          <UpdateTreeSection
            currentIndex={currentIndex}
            nextSlide={nextSlide}
            prevSlide={prevSlide}
            openNext={openNext}
            data={data}
          />
        </div>
        <div className="w-full h-[60px]">
          <UpdateContainer
            width={width}
            openNext={openNext}
            handleNext={handleNext}
            value={newName}
            onChange={handleInput}
            checkTree={checkTree}
            fetchTreeCheck={fetchTreeCheck}
          />
        </div>
      </div>
    </div>
  );
};

export default UpdatePage;
