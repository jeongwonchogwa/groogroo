"use client";

// 사실 이거는 놀랍게도 Gardens의 Header와 같아요.

import IconButton from "@/app/components/IconButton";
import { redirect, useRouter } from "next/navigation";
import { MenuButton } from "@/app/types";
import HomeMenu from "./HomeMenu";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Alarm from "@/app/components/Alarm";
import ButtonModal from "@/app/components/ButtonModal";
import Button from "@/app/components/Button";
import { searchTreeStore } from "@/stores/searchTreeInfo";
import Link from "next/link";
import { userInfoStore } from "@/stores/userInfoStore";

interface HomeHeaderProps {
  handlemenu: () => void;
  menuOpen: boolean;
}

const HomeHeader = ({ handlemenu, menuOpen }: HomeHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const { userToken } = userInfoStore();
  useEffect(() => {
    if (userToken === "") {
      redirect("/");
    }
  }, [userToken]);

  const [openAlarm, setOpenAlarm] = useState<boolean>(false);

  const onAlarmButtonClick = () => {
    setOpenAlarm((prev) => !prev);
  };

  const [openUpdate, setOpenUpdate] = useState<boolean>(false);

  const onUpdateButtonClick = () => {
    setOpenUpdate((prev) => !prev);
  };

  const fetchLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (response.status === 200) {
        const responseData = await response.json();
        console.log(responseData);
        router.push("/enter");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const menuList: MenuButton[] = [
    { name: "로그아웃", clickEvent: () => fetchLogout() },
    {
      name: "문의하기",
      clickEvent: () => router.push("http://pf.kakao.com/_xoIkxbG"),
    },
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
                    router.back();
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
                  router.push("/search");
                }}
              />
            </div>
            {pathname.startsWith("/home") && (
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
      {menuOpen && !openAlarm ? (
        <HomeMenu menuList={menuList}></HomeMenu>
      ) : null}
      {openUpdate && (
        <ButtonModal
          handleModal={onUpdateButtonClick}
          isOpenModal={openUpdate}
          title="나무 수정하기"
          button={
            <div className="grid grid-flow-row gap-2">
              <Button
                color="secondary-container"
                label="프리셋 만들기"
                onClick={() => {
                  router.push("/enter/check");
                  onUpdateButtonClick();
                }}
              />
              <Link
                href={{ pathname: "/enter/createPreset", query: { type: "name" } }}
              >
                <Button
                  color="secondary"
                  label="이름 변경하기"
                  onClick={() => {
                    onUpdateButtonClick();
                  }}
                />
              </Link>
              <Link
                href={{ pathname: "/home/update", query: { type: "preset" } }}
              >
                <Button
                  color="primary"
                  label="프리셋 변경하기"
                  onClick={() => {
                    onUpdateButtonClick();
                  }}
                />
              </Link>
            </div>
          }
        />
      )}
    </>
  );
};

export default HomeHeader;
