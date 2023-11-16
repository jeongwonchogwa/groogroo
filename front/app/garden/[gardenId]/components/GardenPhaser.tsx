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
import { useRouter } from "next/navigation";
import { fetchWithTokenCheck } from "@/app/components/FetchWithTokenCheck";

interface Props {
  gardenId: number;
}

const GardenPhaser = (props: Props) => {
  const router = useRouter();
  const { setGarden } = gardenInfoStore();
  const { userToken } = userInfoStore();
  const [game, setGame] = useState<Phaser.Game>();
  const [currnetTree, setCurrnetTree] = useState<Tree>({
    id: 0,
    treeId: 0,
    fruitCnt: 0,
    imageUrl: "",
    name: "",
    x: 0,
    y: 0,
  });

  const [currentFlower, setCurrentFlower] = useState<Flower>({
    content: "",
    createTime: "",
    id: 0,
    writerId: 0,
    writerNickName: "",
    x: 0,
    y: 0,
    imageUrl: "",
  });
  const [fruitMessageEdit, setFruitMessageEdit] = useState<boolean>(false);
  const [flowerSelect, setFlowerSelect] = useState<boolean>(false);
  const [treeSelect, setTreeSelect] = useState<boolean>(false);
  const [flowerMessageEdit, setFlowerMessageEdit] = useState<boolean>(false);
  const [showFlowerMessage, setShowFlowerMessage] = useState<boolean>(false);
  const [stopBubbling, setStopBubbling] = useState<boolean>(false);

  const onFormCloseButtonClick = () => {
    setFruitMessageEdit(false);
    setFlowerMessageEdit(false);
    setFlowerSelect(false);
    setTreeSelect(false);
    setShowFlowerMessage(false);
    setStopBubbling(false);
    //@ts-ignore
    game!.scene.getScene("gardenScene").modalCheck = false;
  };

  const onTreeClick = (tree: Tree) => {
    if (!stopBubbling) {
      setCurrnetTree(tree);
      setFruitMessageEdit(true);
      setStopBubbling(true);
    }
  };

  const onFlowerClick = async (flower: Flower) => {
    try {
      const res = await fetchWithTokenCheck(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/flower/${flower.id}`,
        {},
        router
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
      const data = await res.json();
      // console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: garden, isLoading } = useQuery({
    queryKey: ["getGardenInfo"],
    queryFn: fetchGardenInfo,
  });

  useEffect(() => {
    //Phaser 생성 시작 함수////////////////////////////////////////////////////////
    const initPhaser = () => {
      setGarden(garden.gardenInfo);
      //씬 매개변수 담아서 생성////////////////////////////////////////////////////
      //씬 생성시 매개변수로 추가된 데이터들은 constructor에서 불러옴
      //이후 scene.start 에서 씬 생성과 같이 넘겨주는 데이터들은
      //init or create 의 매개변수로 받아오기.
      const preloader = new Preloader({
        garden: garden.gardenInfo,
      });

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

      //게임 생성///////////////////////////////////////////////////////////////////
      const phaserGame = new Phaser.Game({
        type: Phaser.AUTO,
        title: "garden",
        parent: "garden-content",
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

    //garden데이터 다 받아왔을 때 시작////////////////////////////////
    if (!isLoading) {
      initPhaser();
    }
    // };
  }, [garden]);

  return (
    <div className="w-full h-full overflow-hidden border-2 border-point-orange ">
      {isLoading ? null : (
        <div>
          <div
            className="relative w-full h-full"
            id="garden-content"
            key="garden-content"
          >
            {game !== undefined ? (
              <GardenHeader
                state={garden.gardenInfo.state}
                garden={garden.gardenInfo}
                game={game}
              />
            ) : null}
          </div>

          {showFlowerMessage ? (
            <div className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-70 z-[60]">
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
            <div className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center px-5 z-[60]">
              <TreeSelect
                onFormCloseButtonClick={onFormCloseButtonClick}
                game={game}
              />
            </div>
          ) : null}

          {flowerSelect ? (
            <div className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center px-5 z-[60]">
              <FlowerSelect
                onFormCloseButtonClick={onFormCloseButtonClick}
                game={game}
              />
            </div>
          ) : null}

          {flowerMessageEdit ? (
            <div className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-70 z-[60]">
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
            <div className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-70 z-[50]">
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
