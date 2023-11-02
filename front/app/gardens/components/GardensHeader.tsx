"use client";

import IconButton from "../../components/IconButton";
import Button from "../../components/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SearchBar from "./SearchBar";

const GardensHeader = () => {
  const router = useRouter();
  const [clickSearch, setClickSearch] = useState<boolean>(false);

  const handleSearch = () => {
    setClickSearch((prev) => !prev);
  };

  return (
    <>
      <div className="flex w-full">
        <div className="flex w-full mt-5 mr-5  justify-end gap-3">
          <div className="w-10 h-10">
            <IconButton onClick={() => router.push("/garden/regist")} iconSrc="plus" />
          </div>
          <div className="w-10 h-10">
            {clickSearch ? (
              <IconButton iconSrc="menu" onClick={() => handleSearch()} />
            ) : (
              <IconButton iconSrc="glass" onClick={() => handleSearch()} />
            )}
          </div>
          <div className="w-10 h-10">
            <IconButton iconSrc="tree" onClick={() => router.push("/home")} />
          </div>
          <div className="w-10 h-10">
            <IconButton iconSrc="bell" />
          </div>
        </div>
      </div>
      {clickSearch ? (
        <div className="mt-4 mx-7">
          <SearchBar />
        </div>
      ) : (
        <div className="mt-8 mx-5">
          <div className="grid grid-flow-col gap-2">
            <Button color="primary" label="내 정원" />
            <Button color="white" label="정원 랭킹" />
          </div>
        </div>
      )}
    </>
  );
};

export default GardensHeader;
