import PixelCard from "@/app/components/PixelCard";
import { MenuButton, Tree } from "@/app/types";

interface Props {
  menuList?: MenuButton[];
  assetList?: Tree[];
}
const Menu = (props: Props) => {
  return (
    <>
      {props.menuList ? (
        <PixelCard menuList={props.menuList} />
      ) : (
        <PixelCard assetList={props.assetList}></PixelCard>
      )}
    </>
  );
};

export default Menu;
