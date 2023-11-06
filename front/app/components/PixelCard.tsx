import { MenuButton, Tree } from "../types";

interface Props {
  content?: React.ReactNode;
  menuList?: MenuButton[];
  assetList?: Tree[];
  isModal?: boolean;
}

const PixelCard = (props: Props) => {
  return (
    <div
      className={`w-fit h-fit flex flex-col border-[15px] ${props.isModal ? "z-40" : ""} border-transparent`}
      style={{
        borderImage: `url("/assets/images/pixelBorder.png") 25`,
      }}
    >
      {props.content
        ? props.content
        : props.menuList
        ? props.menuList.map((element) => (
            <div
              className="flex flex-col bg-white p-3 pb-0 min-w-max gap-2 font-bitBit"
              onClick={element.clickEvent}
              key={element.name}
            >
              {element.name}
              <hr />
            </div>
          ))
        : props.assetList
        ? props.assetList.map((element) => (
            <div className="flex flex-col bg-white p-3 pb-0 min-w-max gap-2 font-bitBit" key={element.id}>
              {element.name}
              <hr />
            </div>
          ))
        : null}
    </div>
  );
};

export default PixelCard;
