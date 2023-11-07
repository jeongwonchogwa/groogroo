import * as type from "./types";

export const tree: type.TreesResponse = {
  httpStatus: "success",
  message: "나무 검색 성공",
  trees: [
    {
      id: 1,
      imageUrl: "/assets/tree.png",
      name: "쿠마수정나무",
      fruits: [
        {
          id: 1,
          writerId: 1,
          writerNickname: "내가누구게",
          content: "잘지내~",
          createTime: "14:10",
        },
      ],
      fruitsCount: 1,
      x: 5,
      y: 10,
    },
    {
      id: 2,
      imageUrl: "/assets/tree.png",
      name: "자라나라나무나무",
      fruits: [
        {
          id: 2,
          writerId: 1,
          writerNickname: "감튀맛있더라",
          content: "벌써 10월도 다갔네",
          createTime: "08:10",
        },
      ],
      fruitsCount: 1,
      x: 20,
      y: 15,
    },
    {
      id: 3,
      imageUrl: "/assets/tree.png",
      name: "나아무",
      fruits: [
        {
          id: 3,
          writerId: 2,
          writerNickname: "차차아버님",
          content: "카페인에 절여지고 있어.",
          createTime: "15:10",
        },
      ],
      fruitsCount: 1,
      x: 9,
      y: 12,
    },
  ],
};

export const myTree: type.Tree = {
  id: 1,
  imageUrl: "/assets/tree.png",
  name: "고무고무나무",
  fruits: [
    {
      id: 1,
      writerId: 1,
      writerNickname: "내가누구게",
      content: "잘지내~",
      createTime: "14:10",
    },
  ],
  fruitsCount: 1,
};

export const admin: type.Admin = {
  httpStatus: "success",
  reportList: [
    {
      id: 1,
      reporterId: 2,
      content: "신고합니디",
      completed: true,
      contentType: "TREE",
      targetId: 1,
    },
    {
      id: 2,
      reporterId: 2,
      content: "신고!!!",
      completed: false,
      contentType: "TREE",
      targetId: 1,
    },
    {
      id: 3,
      reporterId: 2,
      content: "신고요!!!",
      completed: false,
      contentType: "TREE",
      targetId: 1,
    },
    {
      id: 3,
      reporterId: 2,
      content: "신고요!!!",
      completed: false,
      contentType: "TREE",
      targetId: 1,
    },
    {
      id: 3,
      reporterId: 2,
      content: "신고요!!!",
      completed: false,
      contentType: "TREE",
      targetId: 1,
    },
    {
      id: 3,
      reporterId: 2,
      content: "신고요!!!",
      completed: false,
      contentType: "TREE",
      targetId: 1,
    },
    {
      id: 3,
      reporterId: 2,
      content: "신고요!!!",
      completed: false,
      contentType: "TREE",
      targetId: 1,
    },
    {
      id: 3,
      reporterId: 2,
      content: "신고요!!!",
      completed: false,
      contentType: "TREE",
      targetId: 1,
    },
    {
      id: 3,
      reporterId: 2,
      content: "신고요!!!",
      completed: false,
      contentType: "TREE",
      targetId: 1,
    },
    {
      id: 3,
      reporterId: 2,
      content: "신고요!!!",
      completed: false,
      contentType: "TREE",
      targetId: 1,
    },
    {
      id: 3,
      reporterId: 2,
      content: "신고요!!!",
      completed: false,
      contentType: "TREE",
      targetId: 1,
    },
    {
      id: 3,
      reporterId: 2,
      content: "신고요!!!",
      completed: false,
      contentType: "TREE",
      targetId: 1,
    },
  ],
  message: "신고 접수 내역 조회 성공",
};
