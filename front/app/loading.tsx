import Image from "next/image";

const LoadingPage = () => {
  return (
    <div className="w-screen h-screen bg-white flex flex-col items-center justify-center gap-5">
      <Image
        alt="logo"
        src={"/assets/images/groogroo_logo.png"}
        width={300}
        height={100}
      ></Image>
      <Image
        alt="loading"
        src={"/assets/gif/loading.gif"}
        width={100}
        height={30}
      ></Image>
    </div>
  );
};

export default LoadingPage;
