"use client";
// 분리 필요
import IconButton from "@/app/components/IconButton";
import { Preset } from "@/app/types";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

interface UpdateTreeSectionProps {
  currentIndex: number;
  nextSlide: () => void;
  prevSlide: () => void;
  data: Preset[];
}
const UpdateTreeSection = ({
  currentIndex,
  nextSlide,
  prevSlide,
  data,
}: UpdateTreeSectionProps) => {
  const params = useSearchParams();
  const type = params.get("type");
  console.log(data);
  return (
    <>
      {data[currentIndex] && (
        <div className="w-full flex flex-col">
          <div className="w-full flex flex-row px-5 gap-5">
            <div className="w-8 my-auto">
              {type === "preset" && (
                <IconButton iconSrc="arrow" onClick={prevSlide} />
              )}
            </div>
            <div className="h-[300px]">
              <Image
                className="h-full"
                height={200}
                width={300}
                src={data[currentIndex].imageUrl}
                alt={`Image ${currentIndex}`}
              />
            </div>
            <div className="w-8 my-auto">
              {type === "preset" && (
                <IconButton iconSrc="arrow" rotate={true} onClick={nextSlide} />
              )}
            </div>
          </div>
          {type === "preset" && (
            <div className="text-gray-500 mt-4 text-center flex justify-center">
              {data.map((el, i) => {
                return (
                  <div
                    key={i}
                    className={`bg-gray-200 h-[10px] w-[10px] mr-1 rounded ${
                      i === currentIndex ? "bg-rose-400" : ""
                    }`}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default UpdateTreeSection;
