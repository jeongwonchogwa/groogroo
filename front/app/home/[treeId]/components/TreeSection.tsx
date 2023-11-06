import Image from "next/image";

const TreeSection = () => {
  return (
    <div className="w-full h-full">
      <div className="h-[300px] flex justify-center">
        {/* 열매달린 나무가 들어가야해요 */}
        <Image src="/assets/trees/tree[0].svg" width={250} height={100} alt="나무" />
      </div>
    </div>
  );
};

export default TreeSection;
