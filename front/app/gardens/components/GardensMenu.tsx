import PixelCard from "@/app/components/PixelCard";
import { MenuButton } from "@/app/types";

interface Props {
  menuList?: MenuButton[];
}
const GardensMenu = (props: Props) => {
  return (
    <div className="fixed top-16 right-3">
      {props.menuList && <PixelCard menuList={props.menuList} isModal={true} />}
    </div>
  );
};

export default GardensMenu;
