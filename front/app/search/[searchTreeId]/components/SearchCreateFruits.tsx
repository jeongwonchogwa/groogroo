"use client";

import MessageCreator from "@/app/components/MessageCreator";
import Button from "@/app/components/Button";
import React, { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { Tree } from "@/app/types";
import { userInfoStore } from "@/stores/userInfoStore";
import useUserToken from "@/app/hooks/useUserToken";
import useSearchTree from "@/app/hooks/useSearchTree";
import { fetchWithTokenCheck } from "@/app/components/FetchWithTokenCheck";

interface Props {
  onFormCloseButtonClick: () => void;
  currentTree: Tree;
}

const SearchCreateFruits = (props: Props) => {
  const userToken = useUserToken();
  const { treeId, loading, error } = useSearchTree(userToken);

  useEffect(() => {
    if (!loading && !error && treeId === null) {
      redirect("/enter/terms");
    }
  }, [loading, error, treeId]);
  const [writer, setWriter] = useState("");
  const [content, setContent] = useState("");

  const router = useRouter();

  const handleFruitSubmit = async () => {
    try {
      const res = await fetchWithTokenCheck(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/fruit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            treeId: props.currentTree.id,
            writerNickname: writer,
            content: content,
          }),
        },
        router
      );
      const data = await res.json();
      props.onFormCloseButtonClick();
      router.push(`/search/${props.currentTree.id}/fruits`);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="absolute bottom-20 left-0 w-full flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-full flex flex-row">
        <div className="w-full h-72 ml-3 mr-5">
          <MessageCreator
            onWriterChange={setWriter}
            onContentChange={setContent}
          />
        </div>
      </div>
      <div className="mt-7 mx-5">
        <div className="grid grid-flow-col gap-4">
          <Button
            color="default"
            label="취소하기"
            onClick={props.onFormCloseButtonClick}
          />
          <Button
            color="primary"
            label="열매달기"
            onClick={handleFruitSubmit}
            disabled={!writer || !content}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchCreateFruits;
