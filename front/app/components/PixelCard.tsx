import { url } from "inspector";

interface Props {
  content?: React.ReactNode;
  list?: string[];
}

const PixelCard = (props: Props) => {
  return (
    <div
      className="w-fit h-fit flex flex-col border-[15px]  border-transparent"
      style={{
        borderImage: `url("/assets/images/pixelBorder.png") 25`,
      }}
    >
      {props.list
        ? props.list.map((element) => (
            <div
              className="flex flex-col bg-white p-3 pb-0 min-w-max gap-2"
              key={element}
            >
              {element}
              <hr />
            </div>
          ))
        : null}
    </div>
  );
};

export default PixelCard;
