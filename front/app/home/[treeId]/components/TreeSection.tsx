import Image from "next/image";
import { userTreeStore } from "@/stores/userTreeStore";

const TreeSection = () => {
  const { userTree } = userTreeStore();
  return (
    <>
      {userTree?.imageUrl && (
        <div className="w-full h-full">
          <div className="h-[300px] flex justify-center">
            <Image src={userTree.imageUrl} width={250} height={100} alt="나무" />
          </div>
        </div>
      )}
    </>
  );
};

export default TreeSection;
