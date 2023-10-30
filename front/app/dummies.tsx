import * as type from "./types";

export const tree: type.TreesResponse = {
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
      ],
      fruitsCount: 1,
    },
  ],
};
