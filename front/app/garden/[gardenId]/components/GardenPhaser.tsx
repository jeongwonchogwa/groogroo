"use client";
import { useEffect, useState } from "react";
import GardenScene from "./GardenScene";
import Preloader from "./Preloader";
import GridEngine from "grid-engine";
import GardenHeader from "./GardenHeader";
import TreeEditScene from "./TreeEditScene";
import CreateFruit from "./CreateFruit";
import { Flower, Garden, Tree } from "@/app/types";
import PixelCard from "@/app/components/PixelCard";
import Image from "next/image";
import FlowerSelect from "./FlowerSelect";
import FlowerEditScene from "./FlowerEditScene";
import CreateFlower from "./CreateFlower";
import TreeSelect from "./TreeSelect";
import { gardenInfoStore } from "@/stores/gardenInfoStore";
import FlowerMessage from "./FlowerMessage";
import { userInfoStore } from "@/stores/userInfoStore";
import { useQuery } from "@tanstack/react-query";

interface Props {
  gardenId: number;
}

const GardenPhaser = (props: Props) => {
  // const AccessToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
  const { userToken } = userInfoStore();
  const [game, setGame] = useState<Phaser.Game>();
  const [currnetTree, setCurrnetTree] = useState<Tree>({
    id: 0,
    fruitCnt: 0,
    imageUrl: "",
    name: "",
    x: 0,
    y: 0,
  });

  const [currentFlower, setCurrentFlower] = useState<Flower>({
    content:
      "이 꽃은 영국에서 시작되어 지구한바퀴 돌고 한국 역삼 멀티캠퍼스까지 와버린 전설의 꽃.",
    createTime: "14:30",
    id: 0,
    writerId: 0,
    writerNickName: "운영자",
    x: 0,
    y: 0,
    imageUrl: "/assets/flowers/flower[1].svg",
  });
  const [fruitMessageEdit, setFruitMessageEdit] = useState<boolean>(false);
  const [flowerSelect, setFlowerSelect] = useState<boolean>(false);
  const [treeSelect, setTreeSelect] = useState<boolean>(false);
  const [flowerMessageEdit, setFlowerMessageEdit] = useState<boolean>(false);
  const [showFlowerMessage, setShowFlowerMessage] = useState<boolean>(false);
  const [flowerEditSceneState, setFlowerEditSceneState] =
    useState<FlowerEditScene>();
  const [treeEditSceneState, setTreeEditSceneState] = useState<TreeEditScene>();

  const onFormCloseButtonClick = () => {
    console.log("꺼져랏");
    setFruitMessageEdit(false);
    setFlowerMessageEdit(false);
    setFlowerSelect(false);
    setTreeSelect(false);
    setShowFlowerMessage(false);
  };

  const onTreeClick = (tree: Tree) => {
    console.log("켜져랏" + tree);
    setCurrnetTree(tree);
    setFruitMessageEdit(true);
  };

  const onFlowerClick = async (flower: Flower) => {
    console.log(flower);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/flower/${flower.id}`
      );
      const data = await res.json();
      console.log(data);
      setCurrentFlower(data.flower);
      setShowFlowerMessage(true);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const onFlowerSelectOpenButtonClick = () => {
    setFlowerSelect(true);
  };

  const onTreeSelectOpenButtonClick = () => {
    setTreeSelect(true);
  };

  const onFlowerPlantButtonClick = (data: Flower) => {
    setCurrentFlower(data);
    setFlowerMessageEdit(true);
  };

  const fetchGardenInfo = async () => {
    console.log(userToken);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/garden/${props.gardenId}`,

        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      const data = await res.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: garden, isLoading } = useQuery({
    queryKey: ["myGarden"],
    queryFn: fetchGardenInfo,
  });

  useEffect(() => {
    console.log(garden);
    const initPhaser = () => {
      //씬 생성시 매개변수로 추가된 데이터들은 constructor에서 불러옴
      //이후 scene.start 에서 씬 생성과 같이 넘겨주는 데이터들은
      //init or create 의 매개변수로 받아오기.

      const gardenScene = new GardenScene({
        onTreeClick: onTreeClick,
        onFlowerSelectOpenButtonClick: onFlowerSelectOpenButtonClick,
        onTreeSelectOpenButtonClick: onTreeSelectOpenButtonClick,
        onFlowerClick: onFlowerClick,
      });

      const flowerEditScene = new FlowerEditScene({
        onFlowerPlantButtonClick: onFlowerPlantButtonClick,
        garden: garden.gardenInfo,
      });

      const treeEditScene = new TreeEditScene({ garden: garden.gardenInfo });
      const preloader = new Preloader({
        // myTree: myTree,
        garden: garden.gardenInfo,
      });

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

    if (!isLoading) {
      console.log("데이터 새로 보내줘");
      initPhaser();
    }
    // };
  }, [garden, isLoading]);

  return (
    <div className="w-full h-full overflow-hidden border-2 border-point-orange ">
      {isLoading ? null : (
        <div
          className="relative w-full h-full"
          id="garden-content"
          key="garden-content"
        >
          <GardenHeader state={garden.gardenInfo.state} />
          {showFlowerMessage ? (
            <div
              className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-70 z-[60]"
              onClick={(e) => {
                onFormCloseButtonClick();
                e.stopPropagation();
              }}
            >
              <div className="flex flex-col items-center justify-center gap-10 pt-40">
                <Image
                  alt="currentFlower"
                  src={currentFlower.imageUrl}
                  width={250}
                  height={250}
                ></Image>
                <FlowerMessage
                  game={game!}
                  gardenId={garden.gardenInfo.gardenId}
                  currentFlower={currentFlower}
                  onFormCloseButtonClick={onFormCloseButtonClick}
                />
              </div>
            </div>
          ) : null}

          {treeSelect ? (
            <div
              className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center px-5 z-[60]"
              onClick={(e) => {
                onFormCloseButtonClick();
                e.stopPropagation();
              }}
            >
              <TreeSelect
                onFormCloseButtonClick={onFormCloseButtonClick}
                game={game}
              />
            </div>
          ) : null}

          {flowerSelect ? (
            <div
              className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center px-5 z-[60]"
              onClick={(e) => {
                onFormCloseButtonClick();
                e.stopPropagation();
              }}
            >
              <FlowerSelect
                onFormCloseButtonClick={onFormCloseButtonClick}
                game={game}
              />
            </div>
          ) : null}

          {flowerMessageEdit ? (
            <div
              className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-70 z-[60]"
              onClick={(e) => {
                onFormCloseButtonClick;
                e.stopPropagation();
              }}
            >
              <div className="flex flex-col items-center justify-center gap-10 pt-40">
                <Image
                  alt="currentFlower"
                  src={currentFlower.imageUrl}
                  width={250}
                  height={250}
                ></Image>
                <CreateFlower
                  // updateGarden={updateGarden}
                  gardenId={garden.gardenInfo.gardenId}
                  onFormCloseButtonClick={onFormCloseButtonClick}
                  currentFlower={currentFlower}
                  game={game}
                />
              </div>
            </div>
          ) : null}
          {fruitMessageEdit ? (
            <div
              className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-70 z-[60]"
              onClick={(e) => {
                onFormCloseButtonClick();
                e.stopPropagation();
              }}
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
                // updateGarden={updateGarden}
                currentTree={currnetTree}
                gardenId={garden.gardenInfo.gardenId}
                game={game!}
              />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default GardenPhaser;
