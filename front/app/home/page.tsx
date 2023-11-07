"use client";

import { useEffect } from "react";
import HomeFooter from "./components/HomeFooter";
import TreeContainer from "./components/TreeContainer";
import { userInfoStore } from "@/stores/userInfoStore";
import { redirect } from "next/navigation";

const HomePage = () => {
  const { userToken } = userInfoStore();

  // 나무데이터 전역적으로 가지고 있어야해
  const Alldata = [
    {
      httpStatus: "success",
      message: "나무 검색 성공",
      trees: [
        {
          id: 1,
          imageUrl: "주소!!",
          name: "쿠마수정나무",
          fruits: [
            {
              id: 1,
              writerId: 1,
              writerNickname: "내가누구게",
              content: "잘지내~",
              imageUrl: "http://이미지주소",
              createTime: "14:10",
            },
            {
              id: 2,
              writerId: 1,
              writerNickname: "내가누구게",
              content: "잘지내~",
              imageUrl: "http://이미지주소",
              createTime: "14:10",
            },
            {
              id: 3,
              writerId: 1,
              writerNickname: "내가누구게",
              content: "잘지내~",
              imageUrl: "http://이미지주소",
              createTime: "14:10",
            },
            {
              id: 4,
              writerId: 1,
              writerNickname: "내가누구게",
              content: "잘지내~",
              imageUrl: "http://이미지주소",
              createTime: "14:10",
            },
            {
              id: 5,
              writerId: 1,
              writerNickname: "내가누구게",
              content: "잘지내~",
              imageUrl: "http://이미지주소",
              createTime: "14:10",
            },
            {
              id: 6,
              writerId: 1,
              writerNickname: "내가누구게",
              content: "잘지내~",
              imageUrl: "http://이미지주소",
              createTime: "14:10",
            },
            {
              id: 7,
              writerId: 1,
              writerNickname: "내가누구게",
              content: "잘지내~",
              imageUrl: "http://이미지주소",
              createTime: "14:10",
            },
          ],
          fruitsCount: 7,
        },
      ],
    },
  ];

  // fruits 배열 추출
  const data = Alldata[0].trees.map((tree) => tree.fruits).flat();
  console.log(data);

  useEffect(() => {
    // 경로 수정 필요
    if (userToken === "") redirect("/");
  }, [userToken]);
  return (
    <div className="w-full h-[784px]">
      <div className="mx-5 mb-8">
        <TreeContainer />
      </div>
      <div>
        <HomeFooter />
      </div>
    </div>
  );
};

export default HomePage;
