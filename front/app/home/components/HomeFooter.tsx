"use client";

// todo. 스크롤이요..?
import IconButton from "@/app/components/IconButton";
import { useRouter } from "next/navigation";

const HomeFooter = () => {
  const router = useRouter();
  return (
    <div className="w-full h-full mx-auto">
      <div className="text-center">
        <p className=" font-bitBit text-2xl text-white">
          화살표를 클릭하여
          <br /> 정원을 확인해보세요!
        </p>
      </div>
      <div className=" mt-6 w-full flex justify-center">
        <div className="flex w-[58px] animate-bounce">
          <IconButton
            iconSrc="swipe"
            onClick={() => {
              router.push("/gardens");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HomeFooter;
