import PixelCard from "../../components/PixelCard";
import Image from "next/image";
import GardenDetailModal from "./GardenDetailModal";
import { Garden } from "@/app/types";
import { useState } from "react";

// todo. 컴포 분리 필요
interface GardenCardProps {
  gardenList: Garden[];
  sort: string;
}

const GardenCard = ({ sort, gardenList }: GardenCardProps) => {
  const [selectedGardenId, setSelectedGardenId] = useState<number>(0);

  const [open, setOpen] = useState<boolean>(false);

  const handleToggle = (gardenId: number) => {
    setOpen((prevOpen) => !prevOpen);
    // 이거는 모달떄문에 필요한건가?
    setSelectedGardenId(gardenId);
    updateGardenData(gardenId);
  };
  const [gardenData, setGardenData] = useState<Garden>({
    gardenId: 0,
    capacity: 0,
    name: "",
    description: "",
    imageUrl: "",
    state: null,
    likes: 0,
    memberCnt: 0,
    mapType: 0,
    master: "",
  });
  // gardenData를 업데이트하는 함수
  const updateGardenData = (gardenId: number) => {
    const selectedGarden = gardenList.find(
      (garden) => garden.gardenId === gardenId
    );
    if (selectedGarden) {
      setGardenData(selectedGarden);
    }
  };

  return (
    <>
      <div className="flex w-full">
        <div className="w-full flex flex-col">
          {gardenList.length > 0 &&
            gardenList.map((garden, idx) => (
              <div className="mt-5 w-full flex justify-center " key={idx}>
                <PixelCard
                  content={
                    <div
                      className="flex flex-col bg-white"
                      onClick={() => handleToggle(garden.gardenId)}
                    >
                      <div className="w-[300px] h-[100px] outline-dashed outline-2 outline-[#1E3445] rounded-lg mr-1">
                        <div className="w-full h-full relative">
                          {sort === "정원 랭킹" && idx < 3 && (
                            <Image
                              src={`/assets/images/rank[${[idx]}].svg`}
                              alt="등수"
                              width={40}
                              height={100}
                              className="z-20 absolute top-[10px] left-[10px]"
                            />
                          )}
                          {/* <div className="h-[100px] z-10"> */}
                          {/* mapType은 1부터 시작이에요 */}
                          <div className="h-[100px]">
                            <Image
                              src={`/assets/maps/map[${garden.mapType}].jpg`}
                              width={300}
                              height={100}
                              alt="템플릿1"
                              className="rounded-lg w-full h-full absolute object-cover z-10"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex my-4 px-2">
                        <div className="w-full h-full flex flex-col">
                          <div className="flex justify-between h-full">
                            <p className="my-auto font-nexonGothic_Bold text-2xl">
                              {garden.name}
                            </p>
                            <div className="flex justify-between">
                              <div className="flex flex-row mr-3">
                                <div className="my-auto mr-1 w-6 h-6">
                                  <Image
                                    className="w-full h-full object-cover"
                                    src="/assets/images/heart_fill.svg"
                                    width={24}
                                    height={24}
                                    alt="heart"
                                  />
                                </div>
                                <p className="my-auto font-nexonGothic text-lg">
                                  {garden.likes}
                                </p>
                              </div>
                              <div className="my-auto flex flex-row font-nexonGothic text-lg">
                                <span>{garden.memberCnt}</span>
                                <span>/</span>
                                <span>{garden.capacity}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between my-2">
                            <div className=" bg-secondary-container rounded-lg w-fit p-2 font-neoDunggeunmo_Pro text-sm flex flex-row">
                              <div className="w-5 my-auto mr-2">
                                <Image
                                  src="/assets/images/crown.svg"
                                  alt="왕관"
                                  width={100}
                                  height={87}
                                />
                              </div>
                              <span>{garden.master}</span>
                            </div>
                          </div>
                          <div className="mt-2 w-[290px] h-[30px]">
                            <p className="h-full font-nexonGothic text-lg truncate">
                              {garden.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                />
              </div>
            ))}
        </div>
      </div>
      {open && (
        <GardenDetailModal
          isOpen={open}
          handleToggle={() => handleToggle(selectedGardenId)}
          gardenData={gardenData}
        />
      )}
    </>
  );
};

export default GardenCard;
