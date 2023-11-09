import Button from "@/app/components/Button";
import IconButton from "@/app/components/IconButton";
import MessageContainer from "@/app/components/MessageContainer";
import { Flower } from "@/app/types";

interface Props {
  currentFlower: Flower;
}
const FlowerMessage = (props: Props) => {
  return (
    <div onClick={(e) => e.stopPropagation()} className="pl-3 pr-5">
      <div className="nes-container is-rounded bg-white w-full h-full flex flex-col !p-4">
        <div className="w-full flex justify-between">
          <p className="font-nexonGothic text-lg text-text-sub">
            {props.currentFlower.createTime}
          </p>
          <div className="flex flex-row">
            <div className="w-9 h-9 mr-2">
              <IconButton iconSrc="trash" onClick={() => {}} />
            </div>
            <div className=" w-9 h-9">
              <IconButton iconSrc="siren" onClick={() => {}} />
            </div>
          </div>
        </div>
        <div className="w-full mt-2">
          <span className="font-bitBit text-2xl">From. </span>
          <span className="font-bitBit text-2xl">
            {props.currentFlower.writerNickname}
          </span>
        </div>
        <div className="w-full mt-5 overflow-auto">
          <span className="font-nexonGothic text-xl">
            {props.currentFlower.content}
          </span>
        </div>
      </div>
      <Button color="default" label="닫기" />
    </div>
  );
};

export default FlowerMessage;
