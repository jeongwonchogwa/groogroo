// todo. treeId 어떻게 캐치할건지
// 여기서는 treeId를 url에서 가져오는게 나으려나?
"use client";

import FruitMessageContainer from "./components/FruitMessageContainer";
import TreeSection from "./components/TreeSection";

const TreePage = ({ params }: { params: { treeId: string } }) => {
  // treeId 가져옴
  console.log(params.treeId);
  return (
    <div className="w-full h-full">
      <div className="mx-5 my-5">
        <TreeSection />
      </div>
      <div className="mx-4">
        <FruitMessageContainer />
      </div>
    </div>
  );
};
export default TreePage;
