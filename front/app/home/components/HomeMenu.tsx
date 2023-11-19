import PixelCard from "@/app/components/PixelCard";
import { MenuButton } from "@/app/types";

interface Props {
  menuList?: MenuButton[];
}
const HomeMenu = (props: Props) => {
  return (
    <div>
      {props.menuList && <PixelCard menuList={props.menuList} isModal={true} />}
    </div>
  );
};

export default HomeMenu;
