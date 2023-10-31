"use client";

import Button from "@/app/components/Button";
import Image from "next/image";
import { useState } from "react";
import GardenJoinModal from "./GardenJoinModal";

// 여기서 정원의 이름을 넘겨주자
interface GardenDetailModalProps {
  isOpen: boolean;
  handleToggle: () => void;
  selectedGardenId: number;
}

const GardenDetailModal = ({ isOpen, handleToggle, selectedGardenId }: GardenDetailModalProps) => {
  const [joinModalOpen, setJoinModalOpen] = useState<boolean>(false);

  if (!isOpen) return null;
  console.log(selectedGardenId);

  const handleModal = () => {
    setJoinModalOpen((prevOpen) => !prevOpen);
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute w-full h-full bg-gray-900 opacity-50" onClick={handleToggle}></div>
        {/* h를 박는게 맞는지 모르겠네요 */}
        <div className="bg-modal-img h-[598px] w-[350px] mx-auto rounded z-50 overflow-y-auto">
          <div className="flex flex-col p-1 h-full">
            <div className="mt-5 mx-7">
              <Button color="primary" label="시크릿 가든" active={false} />
            </div>
            {/* 이렇게 박아 넣는게 맞아..? */}
            <div className="mt-5 ml-[2px] mr-[7px] h-[250px]">
              {/* Image의 width가 더 넓은건 상관이 없는데 좁으면 상관이 있는건가..내가 뭔가 잘못쓰고 있는 것 같은데... */}
              <Image className="h-full object-fill" src="/cat.jpg" alt="템플릿1" width={350} height={350} />
            </div>
            <div className="flex flex-col mt-4">
              <div className="flex justify-end mr-5">
                <div className="flex flex-row mr-5">
                  <div className="my-auto mr-1 w-6 h-6">
                    <Image
                      className="w-full h-full object-cover"
                      src="/assets/images/heart.svg"
                      width={24}
                      height={24}
                      alt="heart"
                    />
                  </div>
                  <p className="my-auto  text-sm">9</p>
                </div>
                <div className="my-auto flex flex-row  text-sm">
                  <span>500</span>
                  <span>/</span>
                  <span>10000</span>
                </div>
              </div>
              <div className="px-4 mt-3">
                <p className=" font-nexonGothic text-lg">
                  야야얍얍얍얍ㅇ뱌얍야뱡뱌얍얍야뱌얍얍야ㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑ
                </p>
              </div>
            </div>
            <div className="mx-5">
              <Button
                onClick={() => {
                  handleModal();
                  console.log("참여신청클릭");
                }}
                color="secondary"
                label="참여신청"
              />
            </div>
          </div>
        </div>
      </div>
      {joinModalOpen && (
        <GardenJoinModal
          isJoinModalOpen={joinModalOpen}
          handleModal={() => handleModal()}
          selectedGardenId={selectedGardenId}
        />
      )}
    </>
  );
};

export default GardenDetailModal;
