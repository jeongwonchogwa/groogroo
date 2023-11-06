import PixelCard from "../../components/PixelCard";
import Image from "next/image";
import GardenDetailModal from "./GardenDetailModal";
import { Garden } from "@/app/types";

interface GardenCardProps {
  gardenList: Garden[];
  handleToggle: (e: any) => void;
  selectedGardenId: number;
  open: boolean;
  gardenData: Garden;
}

const GardenCard = ({ gardenList, handleToggle, selectedGardenId, open, gardenData }: GardenCardProps) => {
  return (
    <>
      <div className="flex w-full">
        <div className="w-full flex flex-col">
          {gardenList.map((garden, idx) => (
            <div className="mt-5 w-full flex justify-center" key={idx}>
              <PixelCard
                content={
                  <div className="flex flex-col bg-white" onClick={() => handleToggle(garden.gardenId)}>
                    <div className="w-[300px] h-[100px]  outline-dashed outline-2 outline-[#1E3445] rounded-lg mr-1">
                      <div className="w-full h-full">
                        <Image
                          src="/cat.jpg"
                          width={300}
                          height={100}
                          alt="템플릿1"
                          className="rounded-lg w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex my-4 px-2">
                      <div className="w-full h-full flex flex-col">
                        <div className="flex justify-between h-full">
                          <p className="my-auto font-nexonGothic_Bold text-2xl">{garden.name}</p>
                          <div className="flex justify-between">
                            <div className="flex flex-row mr-3">
                              <div className="my-auto mr-1 w-6 h-6">
                                <Image
                                  className="w-full h-full object-cover"
                                  src="/assets/images/heart.svg"
                                  width={24}
                                  height={24}
                                  alt="heart"
                                />
                              </div>
                              <p className="my-auto font-nexonGothic text-lg">{garden.likes}</p>
                            </div>
                            <div className="my-auto flex flex-row font-nexonGothic text-lg">
                              <span>{garden.memberCnt}</span>
                              <span>/</span>
                              <span>{garden.capacity}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 w-[290px]">
                          <p className="my-auto font-nexonGothic text-lg">{garden.description}</p>
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
          selectedGardenId={selectedGardenId}
          gardenData={gardenData}
        />
      )}
    </>
  );
};

export default GardenCard;
