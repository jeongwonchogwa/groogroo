import Image from "next/image";

interface ImageContainerProps {
  src: string;
}

const ImageContainer = ({ src }: ImageContainerProps) => {
  return (
    <div className="w-full flex flex-row">
      <div className="my-auto">
        <div className="w-[5px] h-[190px] bg-black" />
      </div>
      <div className="w-full flex flex-col">
        <div className="w-full h-[5px] bg-black"></div>
        <div className="w-full h-[190px]">
          {/* 뭐 여기는 변하겠지? */}
          <Image
            width={300}
            height={190}
            src={src}
            className="w-full h-full"
            alt="img"
          />
        </div>
        <div className="w-full h-[5px] bg-black"></div>
      </div>
      <div className="my-auto">
        <div className="w-[5px] h-[190px] bg-black" />
      </div>
    </div>
  );
};

export default ImageContainer;
