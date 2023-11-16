"use client";
import Button from "@/app/components/Button";
import Frame from "@/app/components/Frame";
import IconButton from "@/app/components/IconButton";
import { Preset, Tree } from "@/app/types";
import { gardenInfoStore } from "@/stores/gardenInfoStore";
import { userInfoStore } from "@/stores/userInfoStore";
import { userTreeStore } from "@/stores/userTreeStore";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  onFormCloseButtonClick: () => void;
  game?: Phaser.Game;
  modify?: boolean;
}

const TreeSelect = (props: Props) => {
  const { userToken } = userInfoStore();
  const [treeNumber, setTreeNumber] = useState<number>(0);
  const prevTree = () => {
    if (treeNumber === 0) {
      setTreeNumber(treeList.presets.length - 1);
    } else {
      setTreeNumber((prev) => prev - 1);
    }
  };

  const nextTree = () => {
    if (treeNumber === treeList.presets.length - 1) {
      setTreeNumber(0);
    } else {
      setTreeNumber((prev) => prev + 1);
    }
  };

  const onTreeSelectButtonClick = (selectedTreeUrl: string) => {
    props.onFormCloseButtonClick;
    if (props.modify && props.game) {
      //@ts-ignore
      props.game.scene.getScene("treeEditScene")!.changeTree("selectedTree")
    } else {
      props.game?.scene.stop("gardenScene");
      props.game?.scene.start("treeEditScene", {
        selectedTreeUrl: selectedTreeUrl,
      });
    }
  };

  const fetchTreeList = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/tree/preset`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const data = await res.json();
      console.log(data);
      // setTreeList(data.presets);
      return data;
    } catch (error) {
      console.error("에러 발생: ", error);
    }
  };

  const { data: treeList, isLoading } = useQuery({
    queryKey: ["getTreeList"],
    queryFn: fetchTreeList,
  });

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
        {isLoading ? null : (
          <Frame
            content={
              <div className="flex items-center bg-white w-full h-full">
                <div className="mx-auto h-[400px] flex items-center justify-between">
                  <Image
                    alt="tree"
                    src={treeList.presets[treeNumber].imageUrl}
                    width={200}
                    height={200}
                  />
                </div>
              </div>
            }
            height={400}
          />
        )}

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
          onClick={() => {
            props.onFormCloseButtonClick();
            onTreeSelectButtonClick(treeList.presets[treeNumber].imageUrl);
          }}
        ></Button>
      </div>
    </div>
  );
};

export default TreeSelect;
