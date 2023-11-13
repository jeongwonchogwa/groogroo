import Image from "next/image";

interface Props {
  treeImg: string;
}

const TreeSection = ({ treeImg }: Props) => {
  return (
    <div className="w-full h-full">
      <div className="h-[300px] flex justify-center">
        <Image src={treeImg} width={250} height={100} alt="나무" />
      </div>
    </div>
  );
};

export default TreeSection;
