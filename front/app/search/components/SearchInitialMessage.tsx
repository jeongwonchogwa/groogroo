import Frame from "@/app/components/Frame";
import Image from "next/image";

const SearchInitnalMessage = () => {
  return (
    <div className="h-fit w-full">
      <Frame
        height={500}
        content={
          <div className="h-full bg-white">
            <div className="w-full h-full flex justify-center mx-3">
              <Image
                src="/assets/images/cat_pixel.svg"
                width={80}
                height={104}
                alt="고양이_픽셀"
              />
              <div className="h-fit my-auto">
                <div className="nes-balloon from-left flex items-center ">
                  <p className=" font-neoDunggeunmo_Pro mt-[-5px]">
                    검색어를 입력하세요!
                  </p>
                </div>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default SearchInitnalMessage;
