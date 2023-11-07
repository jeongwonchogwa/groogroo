"use client";

import { useEffect, useState } from "react";
import GardenScene from "./GardenScene";
import Preloader from "./Preloader";
import GridEngine from "grid-engine";
import GardenHeader from "./GardenHeader";
import GardenEditScene from "./GardenEditScene";
import CreateFruit from "./CreateFruit";
import { Tree } from "@/app/types";
import PixelCard from "@/app/components/PixelCard";
import Image from "next/image";
import FlowerSelect from "./FlowerSelect";
const Garden = () => {
  const AccessToken =
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJraW1qdzM5MjhAZ21haWwuY29tIiwiaWQiOjU5LCJyb2xlIjoiUk9MRV9VU0VSIiwiaWF0IjoxNjk5MzM3OTc1LCJleHAiOjE3MDA1NDc1NzV9.Ql31eBvnvari9_g4o-s46SsURV9egVz1wcCo2m1vxVw";
  // const AccessToken = localStorage.getItem("access_token");

  const [fruitEdit, setFruitEdit] = useState<boolean>(false);
  const [flowerEdit, setFlowerEdit] = useState<boolean>(false);
  const [selectedFlower, setSelectedFlower] = useState<number>(100);
  const [myTree, setMyTree] = useState<Tree>({
    id: 0,
    fruits: [],
    fruitsCount: 0,
    imageUrl: "",
    name: "",
  });
  const [currnetTree, setCurrnetTree] = useState<Tree>({
    id: 0,
    fruits: [],
    fruitsCount: 0,
    imageUrl: "",
    name: "",
  });
  const onFormCloseButtonClick = () => {
    console.log("꺼져랏");
    setFruitEdit(false);
    setFlowerEdit(false);
  };

  const onFormOpenButtonClick = (tree: Tree) => {
    console.log("켜져랏" + tree);
    setCurrnetTree(tree);
    setFruitEdit(true);
  };

  const onFlowerSelectOpenButtonClick = () => {
    setFlowerEdit(true);
  };

  const onFlowerSelectButtonClick = (index: number) => {
    console.log("꽃 선택 완료!");
    setSelectedFlower(index);
  };

  const getMyTree = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/tree`,
        {
          headers: {
            Authorization: `Bearer ${AccessToken}`,
          },
        }
      );
      const data: Tree = await res.json();
      console.log(data);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const gardenScene = new GardenScene({
      onFormOpenButtonClick: onFormOpenButtonClick,
      onFlowerSelectOpenButtonClick: onFlowerSelectOpenButtonClick,
    });
    const preloader = new Preloader({ myTree: myTree });
    // const gardenEditScene = new GardenEditScene({})

    // const fetchMyTree = async () => {
    //   const Data = await getMyTree();
    //   setMyTree(Data!);
    // };

    // fetchMyTree();

    const initPhaser = () => {
      const phaserGame = new Phaser.Game({
        type: Phaser.AUTO,
        title: "garden",
        parent: "garden-content",
        // 맵 크기
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x000000,
        dom: {
          createContainer: true,
        },
        scene: [preloader, gardenScene, GardenEditScene],
        pixelArt: true,

        physics: {
          default: "arcade",
          arcade: {
            // debug: true,
          },
        },

        plugins: {
          scene: [
            {
              key: "gridEngine",
              plugin: GridEngine,
              mapping: "gridEngine",
            },
          ],
        },
      });

      // setGame(phaserGame);
    };

    initPhaser();
  }, []);

  return (
    <div className="w-full h-full overflow-hidden border-2 border-point-orange ">
      <div
        className="relative w-full h-full"
        id="garden-content"
        key="garden-content"
      >
        <GardenHeader />
        {fruitEdit ? (
          <div
            className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-30 "
            onClick={onFormCloseButtonClick}
          >
            <div className="flex flex-col items-center justify-center gap-2 pt-20">
              <PixelCard
                content={
                  <div className="bg-white font-bitBit py-2 px-3 text-xl">
                    {currnetTree.name}
                  </div>
                }
              ></PixelCard>
              <Image
                alt="currentTree"
                src={currnetTree.imageUrl}
                width={250}
                height={250}
              ></Image>
            </div>
            <CreateFruit
              onFormCloseButtonClick={onFormCloseButtonClick}
              currentTree={currnetTree}
            />
          </div>
        ) : null}

        {flowerEdit ? (
          <div
            className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-30 flex items-center px-5"
            onClick={onFormCloseButtonClick}
          >
            <FlowerSelect
              onFormCloseButtonClick={onFormCloseButtonClick}
              onFlowerSelectButtonClick={onFlowerSelectButtonClick}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Garden;
