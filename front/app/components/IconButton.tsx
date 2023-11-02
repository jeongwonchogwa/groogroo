import Image from "next/image";
import Bell from "/public/assets/images/bell.svg";
import Tree from "/public/assets/images/tree.svg";
import Glass from "/public/assets/images/glass.svg";
import Plus from "/public/assets/images/plus.svg";
import Arrow from "/public/assets/images/arrow.svg";
import Swipe from "/public/assets/images/swipe.svg";
import Kakao from "/public/assets/images/kakao.svg";
import Link from "/public/assets/images/link.svg";
import Trash from "/public/assets/images/trash.svg";
import Siren from "/public/assets/images/siren.svg";
import Flower from "/public/assets/images/flower.png";
import Update from "/public/assets/images/update.svg";
import Home from "/public/assets/images/home.svg";
import Menu from "/public/assets/images/menu.svg";

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
    | "update";
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
};

const IconButton = ({ iconSrc, onClick, rotate }: IconButtonProps) => {
  const IconComponent = iconButtonConfig[iconSrc];
  return (
    <div className="w-full h-full" onClick={onClick}>
      {/* rotate는 arrow에만 사용할 예정 */}
      <Image className={rotate ? "rotate-180" : ""} src={IconComponent} alt={iconSrc} />
    </div>
  );
};

export default IconButton;
