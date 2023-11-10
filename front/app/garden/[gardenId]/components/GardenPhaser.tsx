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

interface Props {
  gardenId: number;
}

const GardenPhaser = (props: Props) => {
  const AccessToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
  // const AccessToken = localStorage.getItem("access_token");
  const [game, setGame] = useState<Phaser.Game>();
  const { garden, setGarden } = gardenInfoStore();

  console.log(garden);
  const [myTree, setMyTree] = useState<Tree>({
    id: 0,
    fruits: [],
    fruitCnt: 0,
    imageUrl: "/assets/trees/tree[1].svg",
    name: "myTree",
  });
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
    writerNickname: "차차아버님",
    x: 0,
    y: 0,
    imageUrl: "/assets/flowers/flower[1].svg",
  });
  const [fruitMessageEdit, setFruitMessageEdit] = useState<boolean>(false);
  const [flowerSelect, setFlowerSelect] = useState<boolean>(false);
  const [treeSelect, setTreeSelect] = useState<boolean>(false);
  const [flowerMessageEdit, setFlowerMessageEdit] = useState<boolean>(false);
  const [showFlowerMessage, setShowFlowerMessage] = useState<boolean>(false);

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
    console.log("켜져랏" + flower);

    // try {
    //   const res = await fetch(
    //     `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/flower/${flower.id}`
    //   );
    //   const responseData = await res.json();
    //   return responseData;
    // } catch (err) {
    //   console.log(err);
    // }

    // setCurrentFlower(flower);
    setShowFlowerMessage(true);
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

  const getGardenInfo = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/garden/${props.gardenId}`,

        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${AccessToken}`,
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

  useEffect(() => {
    const fetchGarden = async () => {
      const Data = await getGardenInfo();
      setGarden(Data.gardenInfo);

      const initPhaser = () => {
        const gardenScene = new GardenScene({
          onTreeClick: onTreeClick,
          onFlowerSelectOpenButtonClick: onFlowerSelectOpenButtonClick,
          onTreeSelectOpenButtonClick: onTreeSelectOpenButtonClick,
          onFlowerClick: onFlowerClick,
        });

        const flowerEditScene = new FlowerEditScene({
          onFlowerPlantButtonClick: onFlowerPlantButtonClick,
          garden: garden,
        });

        const treeEditScene = new TreeEditScene({ garden: Data.gardenInfo });
        const preloader = new Preloader({
          myTree: myTree,
          garden: Data.gardenInfo,
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

      initPhaser();
    };

    fetchGarden();
  }, []);

  return (
    <div className="w-full h-full overflow-hidden border-2 border-point-orange ">
      <div
        className="relative w-full h-full"
        id="garden-content"
        key="garden-content"
      >
        <GardenHeader state={garden.state} />
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
                gardenId={garden.gardenId}
                onFormCloseButtonClick={onFormCloseButtonClick}
                currentFlower={currentFlower}
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
              currentTree={currnetTree}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default GardenPhaser;
