"use client";

import Button from "@/app/components/Button";
import UpdateContainer from "./components/updateContainer";
import UpdateTreeSection from "./components/updateTreeSection";
import { useEffect, useState } from "react";
import { userInfoStore } from "@/stores/userInfoStore";
import { redirect, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/components/Loading";
import useSearchTree from "@/app/hooks/useSearchTree";
import useUserToken from "@/app/hooks/useUserToken";
import { fetchWithTokenCheck } from "@/app/components/FetchWithTokenCheck";

// 이거 참고해서 Gardens 수정하도록
const UpdatePage = () => {
  const userToken = useUserToken();
  const { treeId, loading, error } = useSearchTree(userToken);

  useEffect(() => {
    if (!loading && !error && treeId === null) {
      redirect("/enter/terms");
    }
  }, [loading, error, treeId]);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWidth(window.innerWidth);
    }
  }, []);

  const router = useRouter();

  const fetchPreset = async () => {
    try {
      const response = await fetchWithTokenCheck(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/tree/preset`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${userToken}`,
          },
        },
        router
      );
      const data = await response.json();
      // 'now' 속성이 true인 요소들만 필터링
      const filteredData = data.presets.filter(
        (preset: { now: boolean }) => preset.now === true
      );
      console.log(filteredData);

      return filteredData;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTreeData = async () => {
    try {
      const response = await fetchWithTokenCheck(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/tree`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
        router
      );
      const data = await response.json();
      // data에서 isnow가 true인것 빼고 저장해야함
      console.log(data);
      return data.tree;
    } catch (error) {
      console.log(error);
    }
  };

  const {
    data: treeData,
    isLoading: treeIsLoading,
    isError: treeIsError,
  } = useQuery(["userTree"], fetchTreeData);

  const {
    data: presetData,
    isLoading: presetIsLoading,
    isError: presetIsError,
  } = useQuery(["treePreset"], fetchPreset);

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % presetData.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + presetData.length) % presetData.length
    );
  };

  if (treeIsLoading || presetIsLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full h-[calc(100%-60px)]">
      <div className="flex flex-col">
        <div className="mt-12 mb-7 mx-9">
          <Button color="white" label="나무 바꾸기" active={false} />
        </div>
        <div className="mt-3 h-[300px]">
          <UpdateTreeSection
            userTree={treeData}
            currentIndex={currentIndex}
            nextSlide={nextSlide}
            prevSlide={prevSlide}
            //이때 presetData에서 now가 true가 아닌 애만 보내야해
            data={presetData}
          />
        </div>
        <div className="w-full h-[60px]">
          <UpdateContainer
            userTree={treeData}
            data={presetData[currentIndex]}
            width={width}
          />
        </div>
      </div>
    </div>
  );
};

export default UpdatePage;
