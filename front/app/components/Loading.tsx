import Image from "next/image";

const Loading = () => {
  return (
    <div className="w-full h-[calc(100%-60px)]">
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Image
          alt="로딩중"
          src="/assets/gif/loading.gif"
          width={100}
          height={60}
        />
        <p className=" font-bitBit text-2xl mt-3 text-white">
          잠시만 기다려주세요
        </p>
      </div>
    </div>
  );
};

export default Loading;
