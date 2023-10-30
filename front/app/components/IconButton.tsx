import Image from "next/image";
import Bell from "/public/assets/images/bell.png";
import Tree from "/public/assets/images/tree.png";
import Glass from "/public/assets/images/glass.png";
import Plus from "/public/assets/images/plus.png";
import Arrow from "/public/assets/images/arrow.png";
import Swipe from "/public/assets/images/swipe.png";
import Kakao from "/public/assets/images/kakao.png";
import Link from "/public/assets/images/link.png";
import Trash from "/public/assets/images/trash.png";
import Siren from "/public/assets/images/siren.png";

interface IconButtonProps {
  iconSrc: "bell" | "tree" | "glass" | "plus" | "arrow" | "swipe" | "kakao" | "link" | "trash" | "siren";
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
