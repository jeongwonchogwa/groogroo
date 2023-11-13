import PixelCard from "@/app/components/PixelCard";
import { MenuButton, Tree } from "@/app/types";

interface Props {
  menuList?: MenuButton[];
  assetList?: Tree[];
}
const MenuTextBox = (props: Props) => {

  console.log(props.menuList)
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

export default MenuTextBox;
