"use client";
import IconButton from "@/app/components/IconButton";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Menu from "./MenuTextBox";
import { Garden, MenuButton } from "@/app/types";
import Alarm from "@/app/components/Alarm";
import JoinModal from "./JoinModal";
import KakaoButton from "./KakaoButton";
import { Prosto_One } from "next/font/google";

interface Props {
  garden: Garden;
  state: string;
}

const GardenHeader = (props: Props) => {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [openAlarm, setOpenAlarm] = useState<boolean>(false);
  const [openJoinModal, setOpenJoinModal] = useState<boolean>(false);
  const [menuList, setMenuList] = useState<MenuButton[]>([])

  const onMenuButtonClick = () => {
    setOpenMenu(!openMenu);
    setOpenAlarm(false);
  };

  const onAlarmButtonClick = () => {
    setOpenAlarm(!openAlarm);
    setOpenMenu(false);
  };

  const onJoinButtonClick = () => {
    setOpenJoinModal((prev) => !prev);
  };

  const [uiWidth, setUiWidth] = useState<String>("");
  useEffect(() => {
    setUiWidth(window.innerWidth + "px");
    // if(props.state === "ACCEPT"){
    //   console.log("가입되어 있음")
    //   setMenuList([
    //     { name: "초대하기", clickEvent: () => {} },
    //   ])
    // }else 
    if(props.state === "WAIT"){
      console.log("요청 진행중")
      setMenuList([{ name: "회원가입 신청을 확인중입니다.", clickEvent: () => {} }])
      
    }else if(props.state === "KICK"){
      console.log("추방")
      setMenuList([{ name: "추방당하셨습니다.", clickEvent: () => {} }])
    }else{
      setMenuList([
        {
          name: "참여신청",
          clickEvent: () => {
            onJoinButtonClick;
          },
        },
      ])
    }
  }, []);

  return (
    <div
      className="absolute top-5 px-5 flex gap-5 font-bitBit justify-between"
      style={{ width: `${uiWidth}` }}
    >
      <div className="h-10 w-10">
        <IconButton iconSrc="home" onClick={() => router.push("../")} />
      </div>

      <div className="flex gap-5">
        <div className="flex flex-col gap-2 h-10 w-10">
          <IconButton iconSrc="bell" onClick={onAlarmButtonClick} />
          {openAlarm ? <Alarm /> : null}
        </div>
        {openAlarm ? null : (
          <div className="flex flex-col gap-2 h-10 w-10 items-end z-40">
            {props.state === "ACCEPT" ? (
              <KakaoButton garden={props.garden} />
            ) : (
              <div className="flex flex-col gap-2 h-10 w-10 items-end z-40">
                <IconButton iconSrc="menu" onClick={onMenuButtonClick} />
                {openMenu ? <Menu menuList={menuList}></Menu> : null}
              </div>
            )}
          </div>
        )}
      </div>
      {openJoinModal ?  (
        <div className="absolute">
          <JoinModal
            onJoinButtonClick={onJoinButtonClick}
            gardenId={props.garden.gardenId}
          />
        </div>
      ):null}
    </div>
  );
};

export default GardenHeader;
