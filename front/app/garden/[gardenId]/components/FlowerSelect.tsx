"use client";
import Button from "@/app/components/Button";
import Frame from "@/app/components/Frame";
import IconButton from "@/app/components/IconButton";
import { gardenInfoStore } from "@/stores/gardenInfoStore";
import Image from "next/image";
import { useState } from "react";

interface Props {
  onFormCloseButtonClick: () => void;
  game?: Phaser.Game;
}

const FlowerSelect = (props: Props) => {
  const { garden } = gardenInfoStore();
  const [flowerNumber, setFlowerNumber] = useState<number>(0);
  const flowerList = [
    "/assets/flowers/flower[1].svg",
    "/assets/flowers/flower[2].svg",
    "/assets/flowers/flower[3].svg",
    "/assets/flowers/flower[4].svg",
    "/assets/flowers/flower[5].svg",
    "/assets/flowers/flower[6].svg",
    "/assets/flowers/flower[7].svg",
    "/assets/flowers/flower[8].svg",
    "/assets/flowers/flower[9].svg",
  ];
  const prevFlower = () => {
    if (flowerNumber === 0) {
      setFlowerNumber(flowerList.length - 1);
    } else {
      setFlowerNumber((prev) => prev - 1);
    }
  };

  const nextFlower = () => {
    if (flowerNumber === flowerList.length - 1) {
      setFlowerNumber(0);
    } else {
      setFlowerNumber((prev) => prev + 1);
    }
  };

  const onFlowerSelectButtonClick = (index: number) => {
    props.onFormCloseButtonClick();
    props.game!.scene.stop("gardenScene");
    props.game!.scene.start("flowerEditScene", {
      selectedFlower: index + 1,
      gardenId: garden.gardenId,
    });
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full flex flex-col gap-10 items-center"
    >
      <div className="font-bitBit text-2xl text-white">심을 꽃을 고르세요.</div>
      <div className="w-full flex gap-5">
        <div className="w-8 my-auto">
          {<IconButton iconSrc="arrow" onClick={prevFlower} />}
        </div>
        <Frame
          content={
            <div className="flex items-center bg-white w-full h-full">
              <div className="mx-auto h-[400px] flex items-center justify-between">
                <Image
                  alt="flower"
                  src={flowerList[flowerNumber]}
                  width={200}
                  height={200}
                />
              </div>
            </div>
          }
          height={400}
        />
        <div className="w-8 my-auto">
          {<IconButton iconSrc="arrow" rotate={true} onClick={nextFlower} />}
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
          onClick={() => onFlowerSelectButtonClick(flowerNumber)}
        ></Button>
      </div>
    </div>
  );
};

export default FlowerSelect;
