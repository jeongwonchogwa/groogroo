"use client";

import IconButton from "@/app/components/IconButton";
import Image from "next/image";

interface UpdateTreeSectionProps {
  openNext: boolean;
  currentIndex: number;
  nextSlide: () => void;
  prevSlide: () => void;
  data: string[];
}
const UpdateTreeSection = ({ openNext, currentIndex, nextSlide, prevSlide, data }: UpdateTreeSectionProps) => {
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-row p-5 gap-5">
        <div className="w-8 my-auto">{!openNext && <IconButton iconSrc="arrow" onClick={prevSlide} />}</div>
        <div className="h-[300px]">
          <Image className="h-full" height={200} width={300} src={data[currentIndex]} alt={`Image ${currentIndex}`} />
        </div>
        <div className="w-8 my-auto">
          {!openNext && <IconButton iconSrc="arrow" rotate={true} onClick={nextSlide} />}
        </div>
      </div>
      {!openNext && (
        <div className="text-gray-500 mt-4 text-center flex justify-center">
          {data.map((el, i) => {
            return (
              <div
                key={i}
                className={`bg-gray-200 h-[10px] w-[10px] mr-1 rounded ${i === currentIndex ? "bg-rose-400" : ""}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UpdateTreeSection;
