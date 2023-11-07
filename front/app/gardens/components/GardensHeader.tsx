"use client";

import IconButton from "../../components/IconButton";
import Button from "../../components/Button";
import { useRouter } from "next/navigation";
import GardensMenu from "./GardensMenu";
import { MenuButton } from "@/app/types";
import { useState } from "react";
import Alarm from "@/app/components/Alarm";

// Todo. HomeHeader와 GardensHeader는 완벽하게 같아요 왜 너는 안 합치고 있나요? 머리가 안돌아가세여?
interface GardenHeaderProp {
  clickText: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handlemenu: () => void;
  menuOpen: boolean;
}

const GardensHeader = ({
  clickText,
  handlemenu,
  menuOpen,
}: GardenHeaderProp) => {
  const router = useRouter();

  const [openAlarm, setOpenAlarm] = useState(false);

  const onAlarmButtonClick = () => {
    setOpenAlarm(!openAlarm);
  };

  const bellClick = openAlarm ? "w-10 h-10 z-50" : "w-10 h-10";

  const menuList: MenuButton[] = [
    // link가 아니라 router로 해버렸다..
    { name: "로그아웃", clickEvent: () => {} },
    {
      name: "문의하기",
      clickEvent: () => router.push("http://pf.kakao.com/_xoIkxbG"),
    },
  ];

  return (
    <>
      <div className="flex w-full">
        <div className="flex w-full mt-5 justify-between px-5">
          <div className="ml-2">
            <div className="w-10 h-10">
              <IconButton iconSrc="home" onClick={() => router.push("/home")} />
            </div>
          </div>
          <div className="flex flex-row gap-3">
            <div className="w-10 h-10">
              <IconButton
                onClick={() => router.push("/garden/regist")}
                iconSrc="plus"
              />
            </div>
            <div className={bellClick}>
              <IconButton iconSrc="bell" onClick={onAlarmButtonClick} />
              {/* {openAlarm ? <Alarm /> : null} */}
            </div>
            <div className="w-10 h-10">
              <IconButton
                iconSrc="menu"
                onClick={() => {
                  handlemenu();
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[30px] mx-5">
        <div className="grid grid-flow-col gap-2">
          <Button color="primary" label="내 정원" onClickText={clickText} />
          <Button color="white" label="정원 랭킹" onClickText={clickText} />
        </div>
      </div>
      {menuOpen ? <GardensMenu menuList={menuList}></GardensMenu> : null}
    </>
  );
};

export default GardensHeader;
