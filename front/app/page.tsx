import Image from "next/image";
import MessageContainer from "./components/MessageContainer";


export default function Home() {
  return (
    <div className="w-screen h-screen bg-background-pixel bg-cover">
      <div className="flex w-full">
        <div className="text-2xl">메인페이지</div>
      </div>
    </div>
  );
}
