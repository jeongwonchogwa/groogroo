"use client";

import PixelCard from "../../components/PixelCard";
import Image from "next/image";
import { useState } from "react";
import GardenDetailModal from "./GardenDetailModal";

const GardenCard = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedGardenId, setSelectedGardenId] = useState<number>(0);

  const handleToggle = (gardenId: number) => {
    setOpen((prevOpen) => !prevOpen);
    setSelectedGardenId(gardenId);
  };

  return (
    <>
      <div className="flex w-full mt-5">
        <div className="w-full flex justify-center">
          {/* 테스트 중... */}
          <div
            className="w-fit h-fit flex flex-col border-[15px] relative border-transparent"
            style={{
              borderImage: `url("/assets/images/pixelBorder.png") 25`,
            }}
          >
            <div className="flex flex-col bg-white" onClick={() => handleToggle(2)}>
              <div className="w-[300px] h-[100px]  outline-dashed outline-2 outline-[#1E3445] rounded-lg mr-1 z-50">
                <div className="w-full h-full">
                  <Image
                    src="/cat.jpg"
                    width={300}
                    height={100}
                    alt="템플릿1"
                    className=" rounded-lg w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex my-4 px-2">
                <div className="w-full h-full flex flex-col">
                  <div className="flex justify-between h-full">
                    <p className="my-auto font-nexonGothic_Bold text-2xl">시크릿가든</p>
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
                        <p className="my-auto font-nexonGothic text-lg">8</p>
                      </div>
                      <div className="my-auto flex flex-row font-nexonGothic text-lg">
                        <span>8</span>
                        <span>/</span>
                        <span>10</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="my-auto font-nexonGothic text-lg">흠</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <PixelCard
            content={
              <div className="flex flex-col bg-white" onClick={() => handleToggle(2)}>
                <div className="w-[400px] h-[100px] z-50">
                  <div className="w-full h-full">
                    <Image
                      src="/cat.jpg"
                      width={300}
                      height={100}
                      alt="템플릿1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex my-4 px-2">
                  <div className="w-full h-full flex flex-col">
                    <div className="flex justify-between h-full">
                      <p className="my-auto font-nexonGothic_Bold text-2xl">시크릿가든</p>
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
                          <p className="my-auto font-nexonGothic text-lg">8</p>
                        </div>
                        <div className="my-auto flex flex-row font-nexonGothic text-lg">
                          <span>8</span>
                          <span>/</span>
                          <span>10</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="my-auto font-nexonGothic text-lg">흠</p>
                    </div>
                  </div>
                </div>
              </div>
            }
          /> */}
        </div>
      </div>
      {open && (
        <GardenDetailModal
          isOpen={open}
          handleToggle={() => handleToggle(selectedGardenId)}
          selectedGardenId={selectedGardenId}
        />
      )}
    </>
  );
};

export default GardenCard;
