"use client";

import MessageCreator from "@/app/components/MessageCreator";
import Button from "@/app/components/Button";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Tree } from "@/app/types";
import { userInfoStore } from "@/stores/userInfoStore";
import { fetchWithTokenCheck } from "@/app/components/FetchWithTokenCheck";

interface Props {
  onFormCloseButtonClick: () => void;
  currentTree: Tree;
  gardenId: number;
  game: Phaser.Game;
}

const CreateFruit = (props: Props) => {
  // const AccessToken = localStorage.getItem("access_token");
  const { userToken } = userInfoStore();
  const router = useRouter();
  const [writer, setWriter] = useState("");
  const [content, setContent] = useState("");

  const handleFruitSubmit = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/fruit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            treeId: props.currentTree.treeId,
            writerNickname: writer,
            content: content,
          }),
        }
      );
      const data = await res.json();
      try {
        const res = await fetchWithTokenCheck(
          `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/garden/${props.gardenId}`,

          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          },
          router
        );
        const gardenData = await res.json();
        //@ts-ignore
        props.game!.scene.getScene("preloader").garden = gardenData.gardenInfo;
        //@ts-ignore
        props.game!.scene.getScene("flowerEditScene").garden =
          gardenData.gardenInfo;
        //@ts-ignore
        props.game!.scene.getScene("treeEditScene").garden =
          gardenData.gardenInfo;
        props.onFormCloseButtonClick();
        props.game.sound.stopAll();
        props.game?.scene.stop("gardenScene");
        props.game?.scene.start("preloader");
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="w-full flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-full flex flex-row">
        <div className="w-full ml-3 mr-5">
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
            label="열매달기"
            onClick={handleFruitSubmit}
            disabled={!writer || !content}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateFruit;
