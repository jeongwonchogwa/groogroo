import * as type from "./types";

export const treeList: type.TreesResponse = {
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
      fruitCnt: 1,
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
      fruitCnt: 1,
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
      fruitCnt: 1,
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
  fruitCnt: 1,
};

export const gardenExample: type.Garden = {
  gardenId: 1,
  description: "정원정원정원",
  name: "카더가든",
  state: "ACCEPT",
  flowerPosList: [
    { id: 1, imageUrl: "/assets/flowers/flower[1].svg", x: 5, y: 0 },
    { id: 2, imageUrl: "/assets/flowers/flower[2].svg", x: 6, y: 0 },
    { id: 3, imageUrl: "/assets/flowers/flower[3].svg", x: 5, y: 1 },
    { id: 4, imageUrl: "/assets/flowers/flower[4].svg", x: 6, y: 1 },
    { id: 5, imageUrl: "/assets/flowers/flower[5].svg", x: 6, y: 9 },
    { id: 6, imageUrl: "/assets/flowers/flower[6].svg", x: 6, y: 10 },
    { id: 7, imageUrl: "/assets/flowers/flower[7].svg", x: 7, y: 9 },
    { id: 8, imageUrl: "/assets/flowers/flower[8].svg", x: 7, y: 10 },
    { id: 9, imageUrl: "/assets/flowers/flower[9].svg", x: 6, y: 8 },
    { id: 10, imageUrl: "/assets/flowers/flower[8].svg", x: 7, y: 8 },
    { id: 11, imageUrl: "/assets/flowers/flower[7].svg", x: 13, y: 8 },
    { id: 12, imageUrl: "/assets/flowers/flower[6].svg", x: 12, y: 8 },
    { id: 13, imageUrl: "/assets/flowers/flower[5].svg", x: 14, y: 8 },
    { id: 14, imageUrl: "/assets/flowers/flower[4].svg", x: 13, y: 7 },
    { id: 15, imageUrl: "/assets/flowers/flower[3].svg", x: 14, y: 7 },
  ],
  treePosList: [
    {
      id: 1,
      name: "자라나라나무나무",
      fruitCnt: 2,
      imageUrl: "/assets/trees/tree[0].svg",
      x: 15,
      y: 10,
    },
    {
      id: 2,
      name: "튼튼한 나무",
      fruitCnt: 2,
      imageUrl: "/assets/trees/tree[1].svg",
      x: 10,
      y: 10,
    },
    {
      id: 3,
      name: "나무나무열매열매",
      fruitCnt: 2,
      imageUrl: "/assets/trees/tree[2].svg",
      x: 17,
      y: 12,
    },
    {
      id: 4,
      name: "나무?",
      fruitCnt: 2,
      imageUrl: "/assets/trees/tree[3].svg",
      x: 15,
      y: 12,
    },
    {
      id: 5,
      name: "나는나무",
      fruitCnt: 2,
      imageUrl: "/assets/trees/tree[4].svg",
      x: 19,
      y: 12,
    },
  ],
  imageUrl: "/assets/map1.json",
  likes: 5,
  memberCnt: 5,
  role: "MASTER",
  capacity: 10,
};
