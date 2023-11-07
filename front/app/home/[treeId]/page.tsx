"use client";

import FruitMessageContainer from "./components/FruitMessageContainer";
import TreeSection from "./components/TreeSection";

const TreePage = ({ params }: { params: { treeId: string } }) => {
  console.log(params.treeId);

  // 이 모든것을 page에서 처리? ㅇㅇ.... ㄴㄴㄴㄴㄴㄴㄴㄴㄴ
  return (
    <div className="w-full">
      <div className="mx-5 my-8">
        <TreeSection />
      </div>
      <div className="mx-4">
        <FruitMessageContainer />
      </div>
    </div>
  );
};
export default TreePage;
