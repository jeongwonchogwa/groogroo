"use client";

import Button from "@/app/components/Button";
import { fetchWithTokenCheck } from "@/app/components/FetchWithTokenCheck";
import useSearchTree from "@/app/hooks/useSearchTree";
import useUserToken from "@/app/hooks/useUserToken";
import { Preset, Tree } from "@/app/types";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  data: Preset;
  userTree: Tree;
}
const UpdatePreset = ({ data, userTree }: Props) => {
  const router = useRouter();

  const userToken = useUserToken();
  const { treeId, loading, error } = useSearchTree(userToken);

  useEffect(() => {
    if (!loading && !error && treeId === null) {
      redirect("/enter/terms");
    }
  }, [loading, error, treeId]);

  const newData: {
    imageUrl: string;
    name: string;
  } = {
    imageUrl: data.imageUrl,
    name: userTree.name,
  };

  const clickChange = async () => {
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
        const responseData = await response.json();
        router.push("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDelete = async () => {
    try {
      const response = await fetchWithTokenCheck(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/tree/preset/${data.treeUserPresetId}`,
        {
          method: "DELETE",
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
    <div className="flex flex-col p-2 mt-5">
      <div className=" text-center  font-neoDunggeunmo_Pro text-2xl">
        변경할 프리셋을 선택하세요
      </div>
      <div className="mt-3 p-6">
        {data.treeUserPresetId === 0 ? (
          <Button color="secondary" label="변경하기" onClick={clickChange} />
        ) : (
          <div className="grid grid-flow-col gap-4">
            <Button color="error" label="삭제하기" onClick={fetchDelete} />
            <Button color="secondary" label="변경하기" onClick={clickChange} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdatePreset;
