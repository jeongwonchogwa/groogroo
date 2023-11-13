"use client";

import IconButton from "@/app/components/IconButton";
import ImageContainer from "@/app/components/ImageContainer";

interface Props {
  currentIndex: number;
  nextMap: () => void;
  prevMap: () => void;
  mapdata: string[];
}
const RegistTemplateSection = ({
  currentIndex,
  nextMap,
  prevMap,
  mapdata,
}: Props) => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-start font-neoDunggeunmo_Pro text-lg mb-2">
        정원의 기본 템플릿을 설정해주세요!
      </div>
      <div className="flex w-full flex-row">
        <div className="mx-1 my-auto">
          <IconButton iconSrc="arrow" onClick={prevMap} />
        </div>
        <ImageContainer src={mapdata[currentIndex]} />
        <div className="mx-1 my-auto">
          <IconButton iconSrc="arrow" rotate={true} onClick={nextMap} />
        </div>
      </div>
    </div>
  );
};

export default RegistTemplateSection;
