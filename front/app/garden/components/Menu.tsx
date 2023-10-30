import PixelCard from "@/app/components/PixelCard";

interface Props {
  menuList: string[];
}
const Menu = (props: Props) => {
  return <PixelCard list={props.menuList} />;
};

export default Menu;
