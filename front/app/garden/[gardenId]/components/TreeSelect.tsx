"use client";
import Button from "@/app/components/Button";
import Frame from "@/app/components/Frame";
import IconButton from "@/app/components/IconButton";
import { Tree } from "@/app/types";
import { gardenInfoStore } from "@/stores/gardenInfoStore";
import { userTreeStore } from "@/stores/userTreeStore";
import Image from "next/image";
import { useState } from "react";

interface Props {
  onFormCloseButtonClick: () => void;
  game?: Phaser.Game;
}

const TreeSelect = (props: Props) => {
  const { garden } = gardenInfoStore();
  const [treeNumber, setTreeNumber] = useState<number>(0);
  const { userTree } = userTreeStore();
  const treeList = [
    "/assets/trees/tree[0].svg",
    "/assets/trees/tree[1].svg",
    "/assets/trees/tree[2].svg",
    "/assets/trees/tree[3].svg",
    "/assets/trees/tree[4].svg",
    "/assets/trees/tree[5].svg",
    "/assets/trees/tree[6].svg",
    "/assets/trees/tree[7].svg",
  ];
  const prevTree = () => {
    if (treeNumber === 0) {
      setTreeNumber(treeList.length - 1);
    } else {
      setTreeNumber((prev) => prev - 1);
    }
  };

  const nextTree = () => {
    if (treeNumber === treeList.length - 1) {
      setTreeNumber(0);
    } else {
      setTreeNumber((prev) => prev + 1);
    }
  };

  const onTreeSelectButtonClick = (selectedTreeUrl: string) => {
    console.log("나무 선택 완료!" + (selectedTreeUrl + 1));
    props.onFormCloseButtonClick();
    props.game?.scene.stop("gardenScene");
    props.game?.scene.start("treeEditScene", {
      userTreeName: userTree?.name,
      selectedTreeUrl: selectedTreeUrl,
      gardenId: garden.gardenId,
    });
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full flex flex-col gap-10 items-center"
    >
      <div className="font-bitBit text-2xl text-white">
        심을 나무를 고르세요.
      </div>
      <div className="w-full flex gap-5">
        <div className="w-8 my-auto">
          {<IconButton iconSrc="arrow" onClick={prevTree} />}
        </div>
        <Frame
          content={
            <div className="flex items-center bg-white w-full h-full">
              <div className="mx-auto">
                <Image
                  alt="tree"
                  src={treeList[treeNumber]}
                  width={200}
                  height={200}
                />
              </div>
            </div>
          }
          height={400}
        />
        <div className="w-8 my-auto">
          {<IconButton iconSrc="arrow" rotate={true} onClick={nextTree} />}
        </div>
      </div>
      <div className="flex w-full gap-5 px-5">
        <Button
          color="default"
          label="취소"
          onClick={props.onFormCloseButtonClick}
        ></Button>
        <Button
          color="secondary"
          label="선택완료"
          onClick={() => onTreeSelectButtonClick(treeList[treeNumber])}
        ></Button>
      </div>
    </div>
  );
};

export default TreeSelect;
