"use client";

import NameInput from "@/app/components/NameInput";
import { userTreeStore } from "@/stores/userTreeStore";
import { useState } from "react";
import UpdateNameButton from "./updateNameButton";
import { Tree } from "@/app/types";
import { useRouter } from "next/navigation";
import { fetchWithTokenCheck } from "@/app/components/FetchWithTokenCheck";
interface Props {
  userTree: Tree;
}
const UpdateName = ({ userTree }: Props) => {
  // 0 => 나무 input 클릭 | 1 => 유효성 실패 | 2 => 유효성 성공 중복확인 실패 | 3 => 유효성 성공 중복확인 성공
  const [checkTree, setCheckTree] = useState<number>(0);

  const [newName, setNewName] = useState<string>("");

  // 나무 인풋 클릭 여부 확인
  const handleInput = (e: any) => {
    const value = e.target.value;
    setNewName(value);
    setCheckTree(0);
  };

  // 나무 이름 중복확인
  const fetchTreeCheck = () => {
    const isValid = /^[가-힣A-Za-z0-9\s]+$/.test(newName);
    if (!isValid) {
      setCheckTree(1);
    } else {
      fetchTreeNameCheck(newName);
    }
  };

  const router = useRouter();

  const fetchTreeNameCheck = async (name: string) => {
    try {
      const response = await fetchWithTokenCheck(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/tree/check/${name}`,
        {
          method: "GET",
        },
        router
      );
      if (response.status === 200) {
        const responseData = await response.json();
        if (responseData.result) {
          setCheckTree(2);
        } else {
          setCheckTree(3);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col p-2 mt-5">
      <div className=" text-center  font-neoDunggeunmo_Pro text-2xl">
        나무의 새 이름을 정해주세요
      </div>
      <div className="px-2 w-full flex flex-col ml-[15px]">
        <NameInput
          value={newName}
          onChange={handleInput}
          placeholder={userTree.name}
          maxlength={12}
        />
        {checkTree == 1 && (
          <p className="mt-1 font-nexonGothic_Bold text-lg text-error text-start">
            한글, 영어, 숫자, 띄어쓰기만 허용됩니다.
          </p>
        )}

        {checkTree == 2 && (
          <p className="mt-1 font-nexonGothic_Bold text-lg text-error text-start">
            이미 사용중인 나무 이름입니다!
          </p>
        )}
        {checkTree == 3 && (
          <p className="mt-1 font-nexonGothic_Bold text-lg text-primary-container text-start">
            사용가능한 나무 이름입니다!
          </p>
        )}
        {checkTree == 0 && (
          <p
            onClick={fetchTreeCheck}
            className="mt-1 mr-7 font-nexonGothic_Bold text-lg text-primary text-end"
          >
            중복확인
          </p>
        )}
      </div>
      <div className="px-6 pb-4">
        <UpdateNameButton
          checkTree={checkTree}
          userTree={userTree}
          newName={newName}
        />
      </div>
    </div>
  );
};

export default UpdateName;
