import Image from "next/image";
import MessageContainer from "./components/MessageContainer";
import Starting from "./starting";


export default function Home() {
  return (
    <div className="w-screen h-screen bg-background-pixel bg-cover">
      <div className="flex w-full flex-col">
        <div className="mx-5 mt-5">
          <Starting />
        </div>
        <div className="text-2xl">메인페이지</div>
      </div>
    </div>
  );
}
