"use client";
import { useEffect, useState } from "react";
import GardenScene from "./GardenScene";
import Preloader from "./Preloader";
import GridEngine from "grid-engine";
import GardenHeader from "./GardenHeader";
import TreeEditScene from "./TreeEditScene";
import CreateFruit from "./CreateFruit";
import { Flower, FlowerPos, Garden, Tree } from "@/app/types";
import PixelCard from "@/app/components/PixelCard";
import Image from "next/image";
import FlowerSelect from "./FlowerSelect";
import FlowerEditScene from "./FlowerEditScene";
import CreateFlower from "./CreateFlower";
import TreeSelect from "./TreeSelect";

interface Props {
  gardenId: number;
}

const Garden = (props: Props) => {
  const AccessToken =
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJraW1qdzM5MjhAZ21haWwuY29tIiwiaWQiOjU5LCJyb2xlIjoiUk9MRV9VU0VSIiwiaWF0IjoxNjk5MzM3OTc1LCJleHAiOjE3MDA1NDc1NzV9.Ql31eBvnvari9_g4o-s46SsURV9egVz1wcCo2m1vxVw";
  // const AccessToken = localStorage.getItem("access_token");
  const [game, setGame] = useState<Phaser.Game>();
  const [garden, setGarden] = useState<Garden>({
    gardenId: 0,
    name: "정원이름",
    state: null,
    imageUrl: "/assets/map1.json",
    capacity: 0,
    description: "설명",
    treePosList: [{ id: 0, name: "", imagUrl: "", fruitCnt: 0, x: 0, y: 0 }],
    flowerPosList: [{ id: 0, imageUrl: "", x: 0, y: 0 }],
  });
  const [myTree, setMyTree] = useState<Tree>({
    id: 0,
    fruits: [],
    fruitsCount: 0,
    imageUrl: "/assets/trees/tree[1].svg",
    name: "myTree",
  });
  const [currnetTree, setCurrnetTree] = useState<Tree>({
    id: 0,
    fruits: [],
    fruitsCount: 0,
    imageUrl: "",
    name: "",
  });

  const [currentFlower, setCurrentFlower] = useState<Flower>({
    x: 0,
    y: 0,
    imageUrl: "",
  });
  const [fruitEdit, setFruitEdit] = useState<boolean>(false);
  const [flowerEdit, setFlowerEdit] = useState<boolean>(false);
  const [treeEdit, setTreeEdit] = useState<boolean>(false);
  const [flowerMessageEdit, setFlowerMessageEdit] = useState<boolean>(false);

  const onFormCloseButtonClick = () => {
    console.log("꺼져랏");
    setFruitEdit(false);
    setFlowerEdit(false);
    setTreeEdit(false);
  };

  const onFormOpenButtonClick = (tree: Tree) => {
    console.log("켜져랏" + tree);
    setCurrnetTree(tree);
    setFruitEdit(true);
  };

  const onFlowerSelectOpenButtonClick = () => {
    setFlowerEdit(true);
  };

  const onTreeSelectOpenButtonClick = () => {
    setTreeEdit(true);
  };

  const onFlowerPlantButtonClick = (data: Flower) => {
    setCurrentFlower(data);
    setFlowerMessageEdit(true);
  };

  const onFlowerSelectButtonClick = (index: number) => {
    console.log("꽃 선택 완료!" + (index + 1));
    onFormCloseButtonClick();
    game?.scene.stop("gardenScene");
    game?.scene.start("flowerEditScene", {
      selectedFlower: index + 1,
      gardenId: garden.gardenId,
    });
  };

  const onTreeSelectButtonClick = (index: number) => {
    console.log("나무 선택 완료!" + (index + 1));
    onFormCloseButtonClick();
    game?.scene.stop("gardenScene");
    game?.scene.start("treeEditScene", {
      selectedFlower: index + 1,
      gardenId: garden.gardenId,
    });
  };

  const getGardenInfo = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/garden/${props.gardenId}`
      );
      const data: Garden = await res.json();
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
      onTreeSelectOpenButtonClick: onTreeSelectOpenButtonClick,
    });

    const treeEditScene = new TreeEditScene({ myTree: myTree });
    const flowerEditScene = new FlowerEditScene({
      onFlowerPlantButtonClick: onFlowerPlantButtonClick,
    });
    const preloader = new Preloader({ myTree: myTree, garden: garden });

    // const fetchGarden = async () => {
    //   const Data = await getGardenInfo();
    //   setGarden(Data!);
    // };

    // fetchGarden();

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
        scene: [preloader, gardenScene, treeEditScene, flowerEditScene],
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

      setGame(phaserGame);
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
        <GardenHeader state={garden.state} />
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

        {treeEdit ? (
          <div
            className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-30 flex items-center px-5"
            onClick={onFormCloseButtonClick}
          >
            <TreeSelect
              onFormCloseButtonClick={onFormCloseButtonClick}
              onTreeSelectButtonClick={onTreeSelectButtonClick}
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

        {flowerMessageEdit ? (
          <div
            className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-30 "
            onClick={onFormCloseButtonClick}
          >
            <div className="flex flex-col items-center justify-center gap-2 pt-20">
              <Image
                alt="currentFlower"
                src={currentFlower.imageUrl}
                width={250}
                height={250}
              ></Image>
            </div>
            <CreateFlower
              gardenId={garden.gardenId}
              onFormCloseButtonClick={onFormCloseButtonClick}
              currentFlower={currentFlower}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Garden;
