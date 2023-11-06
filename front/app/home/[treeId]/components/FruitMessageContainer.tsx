"use client";

import IconButton from "@/app/components/IconButton";
import MessageContainer from "@/app/components/MessageContainer";
import Button from "@/app/components/Button";
import { useRouter } from "next/navigation";

const FruitMessageContainer = () => {
  const router = useRouter();
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-row">
        <div className="w-7 my-auto">
          {/* 이거는 수정하기 처럼 만들자, 인피니티? 아니면 그냥 한번만 보도록 만들어? */}
          <IconButton
            iconSrc="arrow"
            onClick={() => {
              console.log("왼쪽 화살표 클릭");
            }}
          />
        </div>
        <div className="w-full h-72 mr-3 ml-1">
          <MessageContainer />
        </div>
        <div className="w-7 my-auto">
          <IconButton
            iconSrc="arrow"
            rotate={true}
            onClick={() => {
              console.log("오른쪽 화살표 클릭");
            }}
          />
        </div>
      </div>
      <div className="mt-7 mx-5">
        <div className="grid grid-flow-col gap-4">
          <Button color="default" label="취소하기" onClick={() => router.back()} />
          <Button
            color="primary"
            label="답장하기"
            onClick={() => {
              console.log("답장하기 클릭");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FruitMessageContainer;
