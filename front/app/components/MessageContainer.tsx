"use client";

import { useState } from "react";
import { tree } from "../dummies";
import IconButton from "./IconButton";
import CardModal from "./CardModal";

const MessageContainer = () => {
  // 수정 필요
  const firstTree = tree.trees[0];

  // 해당 나무의 fruits 배열에 접근
  const fruits = firstTree.fruits;

  const firstFruit = fruits[0];

  const [selectedFruitId, setSelectedFruitId] = useState<number>(0);

  const [open, setOpen] = useState<boolean>(false);
  const handleReport = (fruitId: number) => {
    setOpen((prev) => !prev);
    setSelectedFruitId(fruitId);
  };

  return (
    <>
      <div className="nes-container is-rounded bg-white w-full h-full flex flex-col !p-4">
        <div className="w-full flex justify-between">
          <p className="font-nexonGothic text-lg text-text-sub">{firstFruit.createTime}</p>
          <div className="flex flex-row">
            <div className="w-9 h-9 mr-2">
              <IconButton iconSrc="trash" />
            </div>
            <div className=" w-9 h-9">
              {/* 여기에 2대신 fruitId가 들어가야함 */}
              <IconButton iconSrc="siren" onClick={() => handleReport(2)} />
            </div>
          </div>
        </div>
        <div className="w-full mt-2">
          <span className="font-bitBit text-2xl">From. </span>
          <span className="font-bitBit text-2xl">{firstFruit.writerNickname}</span>
        </div>
        <div className="w-full mt-5 overflow-auto">
          <span className="font-nexonGothic text-xl">{firstFruit.content}</span>
        </div>
      </div>
      {open && (
        <CardModal
          isOpen={open}
          handleToggle={() => handleReport(selectedFruitId)}
          label={"신고하기"}
          previousText="채팅 메시지를  신고하거나"
          followingText="정원에서 사용자를 차단할 수 있습니다."
        >
          <div className="flex flex-col p-5">
            <div className="flex flex-col font-nexonGothic">
              <div className="grid grid-cols-4 mt-1">
                <div className="text-gray-500">작성자</div>
                <div>울랄라</div>
              </div>
              <div className="grid grid-cols-4">
                <div className="text-gray-500">내용</div>
                <div>웅냥냥</div>
              </div>
            </div>
            <hr className="mt-2" />
            <div className="flex flex-col">
              <div className="mt-2 font-nexonGothic text-gray-500">신고 사유</div>
              <div className="h-[160px] w-full">
                <textarea
                  placeholder="신고 사유를 작성해주세요"
                  className="p-2 mt-1 w-full h-full resize-none font-nexonGothic_Medium overflow-auto border-outline border-2 rounded-lg"
                ></textarea>
              </div>
            </div>
          </div>
        </CardModal>
      )}
    </>
  );
};

export default MessageContainer;
