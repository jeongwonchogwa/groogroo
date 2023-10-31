import Image from "next/image";
import MessageContainer from "./components/MessageContainer";
import Starting from "./starting";
import Terms from "./terms";
import Create from "./create";



export default function Home() {
  return (
    <div className="w-screen h-screen bg-background-pixel bg-cover">
      <div className="flex w-full">
        <div className="mx-5 mt-5">
          <Create />
        </div>
        <div className="mx-5 mt-5">
          <Terms />
        </div>
        <div className="mx-5 mt-5">
          <Starting />
        </div>
        <div className="text-2xl">메인페이지</div>
      </div>
    </div>
  );
}
