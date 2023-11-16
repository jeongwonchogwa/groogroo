"use client";

import Button from "@/app/components/Button";
import { fetchWithTokenCheck } from "@/app/components/FetchWithTokenCheck";
import TextModal from "@/app/components/TextModal";
import useSearchTree from "@/app/hooks/useSearchTree";
import useUserToken from "@/app/hooks/useUserToken";
import { Tree } from "@/app/types";
import { userInfoStore } from "@/stores/userInfoStore";
import { userTreeStore } from "@/stores/userTreeStore";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
interface Props {
  checkTree: number;
  newName: string;
  userTree: Tree;
}
const UpdateNameButton = ({ checkTree, newName, userTree }: Props) => {
  const router = useRouter();
  const userToken = useUserToken();
  const { treeId, loading, error } = useSearchTree(userToken);

  useEffect(() => {
    if (!loading && !error && treeId === null) {
      redirect("/enter/terms");
    }
  }, [loading, error, treeId]);

  const [checkIsValid, setCheckIsValid] = useState<boolean>(false);

  // timeout 이벤트 걸어줌
  useEffect(() => {
    if (checkIsValid) {
      const timeoutId = setTimeout(() => {
        setCheckIsValid(false);
      }, 2000);

      // 컴포넌트가 언마운트되면 타이머를 정리, 뭐든 왜 정리를 해줘야 하니..
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [checkIsValid]);

  const newData: {
    imageUrl: string;
    name: string;
  } = {
    // 현재 나무 가져가야지?
    imageUrl: userTree.imageUrl,
    name: newName,
  };

  const handleCheckIsValidModal = () => {
    setCheckIsValid((prev) => !prev);
  };
  const clickChange = async () => {
    if (checkTree < 3) {
      handleCheckIsValidModal();
      return;
    }
    try {
      const response = await fetchWithTokenCheck(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/tree`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(newData),
        },
        router
      );
      if (response.status === 200) {
        // 사실 모달을 띄워야 할 것 같긴한데..ㅎ
        const responseData = await response.json();
        router.push("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="grid grid-flow-col gap-4">
        <Button
          color="default"
          label="취소하기"
          onClick={() => router.back()}
        />
        <Button
          color="secondary-container"
          label="변경하기"
          onClick={clickChange}
        />
      </div>
      {checkIsValid && (
        <TextModal
          title="유효성 확인 실패"
          content="나무 이름 유효성을 확인해주세요"
          isOpenModal={checkIsValid}
          state="error"
          handleModal={handleCheckIsValidModal}
        />
      )}
    </>
  );
};
export default UpdateNameButton;
