"use client";

//todo. 나무 수정 버튼 및 나무모양 버튼 말고 프리셋 확인가능한 옷장을 넣어야 하나..?
import IconButton from "@/app/components/IconButton";
import { useRouter } from "next/navigation";

const HomeHeader = () => {
  const router = useRouter();
  return (
    <div className="flex w-full">
      <div className="flex w-full mt-5 mr-5 justify-end gap-3">
        <div className="w-10 h-10">
          <IconButton iconSrc="tree" onClick={() => router.push("/home")} />
        </div>
        <div className="w-10 h-10">
          <IconButton iconSrc="bell" onClick={() => console.log("벨클릭")} />
        </div>
        <div className="w-10 h-10">
          <IconButton iconSrc="update" onClick={() => router.push("/home/update")} />
        </div>
        <div className="w-10 h-10">
          <IconButton iconSrc="menu" onClick={() => router.push("/setting")} />
        </div>
      </div>
    </div>
  );
};

export default HomeHeader;
