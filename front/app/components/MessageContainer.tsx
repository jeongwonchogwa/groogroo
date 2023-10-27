import { tree } from "../dummies";
import IconButton from "./IconButton";

const MessageContainer = () => {
  // 수정 필요
  const firstTree = tree.trees[0];

  // 해당 나무의 fruits 배열에 접근
  const fruits = firstTree.fruits;

  const firstFruit = fruits[0];

  return (
    <div className="nes-container is-rounded bg-white w-full h-80 flex flex-col">
      <div className="w-full flex justify-between">
        <p className="font-nexonGothic text-lg text-text-sub">{firstFruit.createTime}</p>
        <div className="flex flex-row">
          <div className="w-9 h-9 mr-2">
            <IconButton iconSrc="trash" />
          </div>
          <div className=" w-9 h-9">
            <IconButton iconSrc="siren" />
          </div>
        </div>
      </div>
      <div className="w-full mt-2">
        <span className="font-bitBit text-2xl">From. </span>
        <span className="font-bitBit text-2xl">{firstFruit.writerNickname}</span>
      </div>
      <div className="w-full mt-5 overflow-auto">
        <span className="font-nexonGothic text-xl">{firstFruit.content}</span>
      </div>
    </div>
  );
};

export default MessageContainer;
