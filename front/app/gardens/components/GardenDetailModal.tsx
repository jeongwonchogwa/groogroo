"use client";

import Button from "@/app/components/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Garden } from "@/app/types";
import GardenState from "./GardenState";

interface GardenDetailModalProps {
  isOpen: boolean;
  handleToggle: () => void;
  gardenData?: Garden;
}

const GardenDetailModal = ({
  isOpen,
  handleToggle,
  gardenData,
}: GardenDetailModalProps) => {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="absolute w-full h-full bg-gray-900 opacity-50"
          onClick={handleToggle}
        ></div>
        <div className="bg-modal-img h-[598px] w-[350px] mx-auto rounded z-50 overflow-y-auto  scrollbar-hide">
          <div className="flex flex-col p-1 h-full">
            <div className="mt-5 mx-7">
              <Button
                color="primary"
                label={`${gardenData?.name}`}
                active={false}
              />
            </div>
            <div className="mt-5 ml-[2px] mr-[7px] h-[250px] relative">
              <div className="absolute z-10 h-full">
                <Image
                  className="h-full object-fill"
                  src={`/assets/maps/map[${gardenData?.mapType}].jpg`}
                  alt="템플릿1"
                  width={350}
                  height={350}
                />
              </div>
              {gardenData?.state === "ACCEPT" ? (
                <GardenState state="ACCEPT" />
              ) : gardenData?.state === "WAIT" ? (
                <GardenState state="WAIT" />
              ) : null}
            </div>
            <div className="flex flex-col mt-4">
              <div className="flex justify-between mr-5   ml-3">
                <div className="bg-secondary-container rounded-lg w-fit p-1 font-neoDunggeunmo_Pro text-sm flex flex-row">
                  <div className="w-5 my-auto mr-2">
                    <Image
                      src="/assets/images/crown.svg"
                      alt="왕관"
                      width={100}
                      height={87}
                    />
                  </div>
                  <span>{gardenData?.master}</span>
                </div>
                <div className="flex flex-row">
                  <div className="flex flex-row mr-5">
                    <div className="my-auto mr-1 w-6 h-6">
                      <Image
                        className="w-full h-full object-cover"
                        src="/assets/images/heart_fill.svg"
                        width={24}
                        height={24}
                        alt="heart"
                      />
                    </div>
                    <p className="my-auto text-sm">{gardenData?.likes}</p>
                  </div>
                  <div className="my-auto flex flex-row  text-sm">
                    <span>{gardenData?.memberCnt}</span>
                    <span>/</span>
                    <span>{gardenData?.capacity}</span>
                  </div>
                </div>
              </div>

              <div className="px-4 mt-3 h-[90px] overflow-auto">
                <p
                  className=" font-nexonGothic text-lg"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {gardenData?.description}
                </p>
              </div>
            </div>
            <div className="mx-5">
              <Button
                onClick={() => {
                  console.log(gardenData?.gardenId);
                  router.push(
                    `/garden/${gardenData?.url}${gardenData?.gardenId}`
                  );
                }}
                color="secondary"
                label="입장하기"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GardenDetailModal;
