"use client";

import MessageCreator from "@/app/components/MessageCreator";
import Button from "@/app/components/Button";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Flower } from "@/app/types";

interface Props {
  gardenId: number;
  onFormCloseButtonClick: () => void;
  currentFlower: Flower;
}

const CreateFlower = (props: Props) => {
  const AccessToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
  const router = useRouter();
  const [writer, setWriter] = useState("");
  const [content, setContent] = useState("");

  const handleFlowerSubmit = async () => {
    try {
      console.log({
        gardenId: props.gardenId,
        writerNickname: writer,
        imageUrl: props.currentFlower.imageUrl,
        content: content,
        x: props.currentFlower.x,
        y: props.currentFlower.y,
      });
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/flower`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gardenId: props.gardenId,
            writerNickname: writer,
            imageUrl: props.currentFlower.imageUrl,
            content: content,
            x: props.currentFlower.x,
            y: props.currentFlower.y,
          }),
        }
      );
      const data = await res.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="w-full flex flex-col" onClick={(e) => e.stopPropagation()}>
      <div className="w-full flex flex-row">
        <div className="w-full h-72 ml-3 mr-5">
          <MessageCreator
            onWriterChange={setWriter}
            onContentChange={setContent}
          />
        </div>
      </div>
      <div className="mt-7 mx-5">
        <div className="grid grid-flow-col gap-4">
          <Button
            color="default"
            label="취소하기"
            onClick={props.onFormCloseButtonClick}
          />
          <Button
            color="primary"
            label="꽃 심기"
            onClick={handleFlowerSubmit}
            disabled={!writer || !content}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateFlower;
