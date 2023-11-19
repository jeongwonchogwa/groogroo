"use client";

import IconButton from "../../components/IconButton";
import Button from "../../components/Button";
import { redirect, useRouter } from "next/navigation";
import GardensMenu from "./GardensMenu";
import { MenuButton } from "@/app/types";
import { useEffect, useState } from "react";
import Alarm from "@/app/components/Alarm";
import { userInfoStore } from "@/stores/userInfoStore";
import useUserToken from "@/app/hooks/useUserToken";
import useSearchTree from "@/app/hooks/useSearchTree";

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

  const userToken = useUserToken();
  const { treeId, loading, error } = useSearchTree(userToken);

  useEffect(() => {
    if (!loading && !error && treeId === null) {
      redirect("/enter/terms");
    }
  }, [loading, error, treeId]);

  const [openAlarm, setOpenAlarm] = useState(false);

  const onAlarmButtonClick = () => {
    setOpenAlarm(!openAlarm);
  };

  const bellClick = openAlarm ? "w-10 h-10 z-50" : "w-10 h-10";
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

  return (
    <>
      <div className="flex w-full">
        <div className="flex w-full mt-5 justify-between px-5">
          <div className="ml-2">
            <div className="w-10 h-10">
              <IconButton iconSrc="back" onClick={() => router.push("/home")} />
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
              {openAlarm ? <Alarm /> : null}
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="w-10 h-10">
                <IconButton
                  iconSrc="menu"
                  onClick={() => {
                    handlemenu();
                  }}
                />
              </div>
              {menuOpen ? (
                <GardensMenu menuList={menuList}></GardensMenu>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GardensHeader;
