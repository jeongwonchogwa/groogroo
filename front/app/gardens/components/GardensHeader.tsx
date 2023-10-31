"use client";

import IconButton from "../../components/IconButton";
import Button from "../../components/Button";
import { useRouter } from "next/navigation";

const GardensHeader = () => {
  const router = useRouter();
  return (
    <>
      <div className="flex w-full">
        <div className="flex w-full mt-5 mr-5  justify-end gap-3">
          <div className="w-10 h-10">
            <IconButton onClick={() => router.push("/gardens/regist")} iconSrc="plus" />
          </div>
          <div className="w-10 h-10">
            <IconButton iconSrc="glass" />
          </div>
          <div className="w-10 h-10">
            <IconButton iconSrc="tree" />
          </div>
          <div className="w-10 h-10">
            <IconButton iconSrc="bell" />
          </div>
        </div>
      </div>
      <div className="my-5 mx-5">
        <div className="grid grid-flow-col gap-2">
          <Button color="primary" label="내 정원" />
          <Button color="white" label="정원 랭킹" />
        </div>
      </div>
    </>
  );
};

export default GardensHeader;
