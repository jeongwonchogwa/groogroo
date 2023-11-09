"use client";

// 사실 이거는 놀랍게도 Gardens의 Header와 같아요.

import IconButton from "@/app/components/IconButton";
import { useRouter } from "next/navigation";
import { MenuButton } from "@/app/types";
import HomeMenu from "./HomeMenu";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Alarm from "@/app/components/Alarm";
import ButtonModal from "@/app/components/ButtonModal";
import Button from "@/app/components/Button";
import { searchTreeStore } from "@/stores/searchTreeInfo";

interface HomeHeaderProps {
  handlemenu: () => void;
  menuOpen: boolean;
}

const HomeHeader = ({ handlemenu, menuOpen }: HomeHeaderProps) => {
  const router = useRouter();

  const pathname = usePathname();
  console.log(pathname);

  const [openAlarm, setOpenAlarm] = useState<boolean>(false);

  const onAlarmButtonClick = () => {
    setOpenAlarm((prev) => !prev);
  };

  const [openUpdate, setOpenUpdate] = useState<boolean>(false);

  const onUpdateButtonClick = () => {
    setOpenUpdate((prev) => !prev);
  };

  const { searchTreeInfoData } = searchTreeStore();
  const menuList: MenuButton[] = [
    // link가 아니라 router로 해버렸다..
    { name: "로그아웃", clickEvent: () => {} },
    { name: "문의하기", clickEvent: () => router.push("http://pf.kakao.com/_xoIkxbG") },
  ];

  const bellClick = openAlarm ? "w-10 h-10 z-50" : "w-10 h-10";

  return (
    <>
      <div className="flex w-full">
        <div className="flex w-full mt-5 justify-between px-5 relative z-30 ">
          <div className="ml-2">
            {pathname != "/home" && (
              <div className="w-10 h-10">
                <IconButton
                  iconSrc="back"
                  onClick={() => {
                    router.push("/home");
                  }}
                />
              </div>
            )}
          </div>
          <div className="flex flex-row gap-3">
            <div className="w-10 h-10">
              <IconButton
                iconSrc="glass"
                onClick={() => {
                  router.push("/home/search");
                }}
              />
            </div>
            {pathname !== `/home/search/${searchTreeInfoData?.id}` && (
              <div className="w-10 h-10">
                <IconButton iconSrc="update" onClick={onUpdateButtonClick} />
              </div>
            )}
            <div className={bellClick}>
              <IconButton iconSrc="bell" onClick={onAlarmButtonClick} />
              {openAlarm ? <Alarm /> : null}
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
      {menuOpen && !openAlarm ? <HomeMenu menuList={menuList}></HomeMenu> : null}
      {openUpdate && (
        <ButtonModal
          handleModal={onUpdateButtonClick}
          isOpenModal={openUpdate}
          title="나무 수정하기"
          button={
            <div className="grid grid-flow-col gap-2">
              <Button
                color="default"
                label="NEW"
                onClick={() => {
                  router.push("/enter/check");
                  onUpdateButtonClick();
                }}
              />
              <Button
                color="primary"
                label="PRESET"
                onClick={() => {
                  router.push("/home/update");
                  onUpdateButtonClick();
                }}
              />
            </div>
          }
        />
      )}
    </>
  );
};

export default HomeHeader;
