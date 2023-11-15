"use client";

import Button from "@/app/components/Button";
import UpdateContainer from "./components/updateContainer";
import UpdateTreeSection from "./components/updateTreeSection";
import { useEffect, useState } from "react";
import { userInfoStore } from "@/stores/userInfoStore";
import { redirect } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/components/Loading";

const UpdatePage = () => {
  const { userToken } = userInfoStore();

  useEffect(() => {
    if (userToken === "") redirect("/enter");
  }, [userToken]);

  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWidth(window.innerWidth);
    }
  }, []);

  const fetchPreset = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/tree/preset`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTreeData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/tree`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      const data = await response.json();
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
    setCurrentIndex((prevIndex) => (prevIndex + 1) % presetData.presets.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + presetData.presets.length) % presetData.presets.length
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
            data={presetData.presets}
          />
        </div>
        <div className="w-full h-[60px]">
          <UpdateContainer
            userTree={treeData}
            data={presetData.presets[currentIndex]}
            width={width}
          />
        </div>
      </div>
    </div>
  );
};

export default UpdatePage;
