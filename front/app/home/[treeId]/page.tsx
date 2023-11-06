"use client";

import FruitMessageContainer from "./components/FruitMessageContainer";
import TreeSection from "./components/TreeSection";

const TreePage = ({ params }: { params: { treeId: string } }) => {
  console.log(params.treeId);

  // 답장하기 클릭했는지 안했는지 catch
  // 화살표 누르면 메시지 넘어가야함
  // 신고하기 클릭했는지 확인, 신고하기 클릭? 모달 하나 더 띄워야 함
  // 삭제 클릭 확인, 모달 한번 더 띄워야 함
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
