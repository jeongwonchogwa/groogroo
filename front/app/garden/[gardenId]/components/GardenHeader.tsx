"use client";
import IconButton from "@/app/components/IconButton";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Menu from "./Menu";
import { MenuButton } from "@/app/types";
import Alarm from "@/app/components/Alarm";

interface Props {
  state: "ACCEPT" | "REFUSE" | "KICK" | "WAIT" | "WITHDRAWAL" | null;
}

const GardenHeader = (props: Props) => {
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

  let menuList: MenuButton[] = [];

  {
    props.state === "ACCEPT"
      ? (menuList = [
          { name: "초대하기", clickEvent: () => {} },
          { name: "신고하기", clickEvent: () => {} },
        ])
      : props.state === null || "REFUSE" || "WITHDRAWAL"
      ? (menuList = [{ name: "참여신청", clickEvent: () => {} }])
      : props.state === "KICK"
      ? (menuList = [{ name: "추방당하셨습니다.", clickEvent: () => {} }])
      : props.state === "WAIT"
      ? (menuList = [
          { name: "회원가입 신청을 확인중입니다.", clickEvent: () => {} },
        ])
      : null;
  }

  const [uiWidth, setUiWidth] = useState<String>("");
  useEffect(() => {
    setUiWidth(window.innerWidth + "px");
  }, []);

  return (
    <div
      className="absolute top-5 px-5 flex gap-5 font-bitBit justify-between"
      style={{ width: `${uiWidth}` }}
    >
      <div className="h-10 w-10 z-40">
        <IconButton iconSrc="home" onClick={() => router.push("../")} />
      </div>

      <div className="flex gap-5">
        <div className="flex flex-col gap-2 h-10 w-10">
          <IconButton iconSrc="bell" onClick={onAlarmButtonClick} />
          {openAlarm ? <Alarm /> : null}
        </div>
        {openAlarm ? null : (
          <div className="flex flex-col gap-2 h-10 w-10 items-end z-40">
            <IconButton iconSrc="menu" onClick={onMenuButtonClick} />
            {openMenu ? <Menu menuList={menuList}></Menu> : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default GardenHeader;
