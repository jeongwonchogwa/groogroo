"use client";

import IconButton from "@/app/components/IconButton";
import { useState } from "react";
import Menu from "./Menu";
import { MenuButton } from "@/app/types";
import { treeList } from "@/app/dummies";
import { gardenEditStore } from "@/stores/gardenEditStore";

const GardenFooter = () => {
  const { setGardenEdit } = gardenEditStore();
  const [openRegistMenu, setOpenRegistMenu] = useState(false);
  const [openTreeList, setOpenTreeList] = useState(false);
  const [openFlowerList, setOpenFlowerList] = useState(false);

  const onRegistMenuButtonClick = () => {
    setOpenRegistMenu(!openRegistMenu);
    setOpenTreeList(false);
    setOpenFlowerList(false);
  };

  const onTreeButtonClick = () => {
    setOpenRegistMenu(false);
    setOpenTreeList(!openTreeList);
    setOpenFlowerList(false);
  };

  const onFlowerButtonClick = () => {
    setOpenRegistMenu(false);
    setOpenTreeList(false);
    setOpenFlowerList(!openFlowerList);
  };

  const registMenu: MenuButton[] = [
    {
      name: "나무 심기",
      clickEvent: setGardenEdit,
    },
    { name: "꽃 심기", clickEvent: () => {} },
  ];

  const uiWidth = window.innerWidth + "px";
  return (
    <div
      className="absolute bottom-5 px-5 flex justify-between"
      style={{ width: `${uiWidth}` }}
    >
      <div className="flex flex-col-reverse gap-2 h-10 w-10">
        <IconButton iconSrc="plus" onClick={onRegistMenuButtonClick} />
        {openRegistMenu ? <Menu menuList={registMenu}></Menu> : null}
      </div>
      <div className="flex gap-5">
        <div className="flex flex-col-reverse gap-2 h-10 w-10 items-end">
          <IconButton iconSrc="flower" onClick={onFlowerButtonClick} />
          {openFlowerList ? <Menu assetList={treeList.trees}></Menu> : null}
        </div>

        <div className="flex flex-col-reverse gap-2 h-10 w-10 items-end">
          <IconButton iconSrc="tree" onClick={onTreeButtonClick} />
          {openTreeList ? <Menu assetList={treeList.trees}></Menu> : null}
        </div>
      </div>
    </div>
  );
};

export default GardenFooter;
