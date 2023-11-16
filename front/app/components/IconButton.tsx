import Image from "next/image";
import Bell from "/public/assets/images/bell.svg";
import Tree from "/public/assets/images/tree.svg";
import Glass from "/public/assets/images/glass.svg";
import Plus from "/public/assets/images/plus.svg";
import Arrow from "/public/assets/images/arrow.svg";
import Swipe from "/public/assets/images/swipe.svg";
// import Kakao from "/public/assets/images/kakao.svg";
import Kakao from "/public/assets/images/kakaoBordered.svg";
import Link from "/public/assets/images/link.svg";
import Trash from "/public/assets/images/trash.svg";
import Siren from "/public/assets/images/siren.svg";
import Flower from "/public/assets/images/flower.png";
import Update from "/public/assets/images/update.svg";
import Home from "/public/assets/images/home.svg";
import Menu from "/public/assets/images/menu.svg";
import User from "/public/assets/images/user.png";
import Back from "/public/assets/images/back.svg";
import Move from "/public/assets/images/move.svg";
import Close from "/public/assets/images/close.svg";

interface IconButtonProps {
  iconSrc:
    | "bell"
    | "tree"
    | "glass"
    | "plus"
    | "arrow"
    | "swipe"
    | "kakao"
    | "link"
    | "trash"
    | "siren"
    | "flower"
    | "home"
    | "menu"
    | "update"
    | "user"
    | "back"
    | "move"
    | "close";
  onClick?: () => void;
  rotate?: boolean;
}

const iconButtonConfig = {
  bell: Bell,
  tree: Tree,
  glass: Glass,
  plus: Plus,
  arrow: Arrow,
  swipe: Swipe,
  kakao: Kakao,
  link: Link,
  trash: Trash,
  siren: Siren,
  flower: Flower,
  home: Home,
  menu: Menu,
  update: Update,
  user: User,
  back: Back,
  move: Move,
  close: Close,
};

const IconButton = ({ iconSrc, onClick, rotate }: IconButtonProps) => {
  const IconComponent = iconButtonConfig[iconSrc];
  return (
    <div
      className={
        iconSrc === "bell" ? "w-full h-full z-50 relative" : "w-full h-full"
      }
      onClick={onClick}
    >
      {/* rotate는 arrow에만 사용할 예정 */}
      <Image
        id={iconSrc === "swipe" ? "swipe" : ""}
        className={rotate ? "rotate-180" : ""}
        src={IconComponent}
        alt={iconSrc}
      />
    </div>
  );
};

export default IconButton;
