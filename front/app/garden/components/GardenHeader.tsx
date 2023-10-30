"use client";
import IconButton from "@/app/components/IconButton";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Menu from "./Menu";
const GardenHeader = () => {
  const router = useRouter();

  const [openMenu, setOpenMenu] = useState(false);
  const [openAlarm, setOpenAlarm] = useState(false);

  const onMenuButtonClick = () => {
    setOpenMenu(!openMenu);
    setOpenAlarm(false);
  };

  const onAlarmButtonClick = () => {
    setOpenAlarm(!openAlarm);
    setOpenMenu(false);
  };

  return (
    <div className="flex gap-5 font-bitBit justify-between">
      <div className="h-10 w-10">
        <IconButton iconSrc="home" onClick={() => router.push("./")} />
      </div>

      <div className="flex gap-5">
        <div className="flex flex-col gap-2 h-10 w-10 items-end">
          <IconButton iconSrc="bell" onClick={onAlarmButtonClick} />
          {openAlarm ? <Menu menuList={["초대하기", "신고하기"]}></Menu> : null}
        </div>

        <div className="flex flex-col gap-2 h-10 w-10 items-end">
          <IconButton iconSrc="menu" onClick={onMenuButtonClick} />
          {openMenu ? <Menu menuList={["초대하기", "신고하기"]}></Menu> : null}
        </div>
      </div>
    </div>
  );
};

export default GardenHeader;
