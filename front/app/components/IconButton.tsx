import Image from "next/image";
import Bell from "/public/asset/images/bell.png";
import Tree from "/public/asset/images/tree.png";
import Glass from "/public/asset/images/glass.png";
import Plus from "/public/asset/images/plus.png";
import Arrow from "/public/asset/images/arrow.png";
import Swipe from "/public/asset/images/swipe.png";
import Kakao from "/public/asset/images/kakao.png";
import Link from "/public/asset/images/link.png";

interface IconButtonProps {
  iconSrc: "bell" | "tree" | "glass" | "plus" | "arrow" | "swipe" | "kakao" | "link";
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
