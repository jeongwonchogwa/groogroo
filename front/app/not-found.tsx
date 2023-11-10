import Image from "next/image";

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col justify-center items-center mx-10">
      <Image src="assets/images/not_found.svg" alt="404 not found" width={400} height={350} priority/>
      <div className="font-bitBit text-rose-500 mt-10">요청하신 페이지를 찾을 수 없습니다.</div>
    </div>
  );
}