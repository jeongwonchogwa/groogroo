import PixelCard from "@/app/components/PixelCard";
import { MenuButton } from "@/app/types";

interface Props {
  menuList?: MenuButton[];
}
const HomeMenu = (props: Props) => {
  return (
    <div className="absolute top-12 right-0">
      {props.menuList && <PixelCard menuList={props.menuList} isModal={true} />}
    </div>
  );
};

export default HomeMenu;
