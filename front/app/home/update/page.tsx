"use client";

import Button from "@/app/components/Button";
import UpdateContainer from "./components/updateContainer";
import UpdateTreeSection from "./components/updateTreeSection";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/components/Loading";
import useSearchTree from "@/app/hooks/useSearchTree";
import useUserToken from "@/app/hooks/useUserToken";
import { fetchWithTokenCheck } from "@/app/components/FetchWithTokenCheck";
import { Tree } from "@/app/types";
import { fetchTreeData } from "@/app/services/fetchTreeData";

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
      const filteredData = data.presets.filter((preset: { now: boolean }) => preset.now === true);
      return filteredData;
    } catch (error) {
      console.log(error);
    }
  };

  const {
    data: treeData,
    isLoading: treeIsLoading,
    isError: treeIsError,
  } = useQuery<Tree>(["userTree"], () => fetchTreeData(userToken, router), {
    enabled: !!userToken, // userToken이 존재할 때만 쿼리 활성화
    staleTime: 10000, // 10초 이내에는 캐시된 결과를 사용
  });

  const {
    data: presetData,
    isLoading: presetIsLoading,
    isError: presetIsError,
  } = useQuery(["treePreset"], fetchPreset, {
    staleTime: 10000, // 10초 이내에는 캐시된 결과를 사용
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % presetData.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + presetData.length) % presetData.length);
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
          {treeData && (
            <UpdateTreeSection
              currentIndex={currentIndex}
              nextSlide={nextSlide}
              prevSlide={prevSlide}
              data={presetData}
              userTree={treeData}
            />
          )}
        </div>
        {treeData && <UpdateContainer userTree={treeData} data={presetData[currentIndex]} width={width} />}
      </div>
    </div>
  );
};

export default UpdatePage;
