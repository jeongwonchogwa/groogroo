export interface Fruit {
  id: number;
  writerId: number;
  writerNickname: string;
  content: string;
  createTime: string;
}

export interface Tree {
  id: number;
  imageUrl: string;
  name: string;
  fruits: Fruit[];
  fruitsCount?: number;
  x?: number;
  y?: number;
}

export interface Flower {
  id?: number;
  imageUrl: string;
  x?: number;
  y?: number;
}

export interface TreesResponse {
  httpStatus: string;
  message: string;
  trees: Tree[];
}

export interface Report {
  id: number;
  reporterId: number;
  content: string;
  completed: null | true | false;
  contentType: "TREE" | "GARDEN" | "FRUIT" | "FLOWER";
  targetId: number;
}

export interface Admin {
  httpStatus: string;
  reportList: Report[];
  message: string;
}

export interface User {
  id: number;
  email: string;
  userStatus: string;
  userRoll: string;
  createTime: string;
  provider: "naver" | "google" | "kakao";
}

export interface MenuButton {
  name: string;
  clickEvent: () => void;
}
export interface SpritePosition {
  x: number;
  y: number;
}
export interface Character {
  id: string;
  sprite: Phaser.Physics.Arcade.Sprite;
  startPosition: SpritePosition;
  tileHeight: number;
  tileWidth: number;
  offsetX: number;
  offsetY: number;
}

export interface Garden {
  gardenId: number;
  name: string;
  description: string;
  url?: string;
  role?: string;
  imageUrl?: string;
  capacity: number;
  state: "ACCEPT" | "REFUSE" | "KICK" | "WAIT" | "WITHDRAWAL" | null;
  memberCnt?: number;
  likes?: number;
  treePosList?: TreePos[];
  flowerPosList?: FlowerPos[];
}

export interface TreePos {
  id: number;
  name: string;
  imagUrl: string;
  fruitCnt: number;
  x: number;
  y: number;
}

export interface FlowerPos {
  id: number;
  imageUrl: string;
  x: number;
  y: number;
}

export interface Report {
  completed: boolean | null;
  content: string;
  contentType: "TREE" | "GARDEN" | "FLOWER" | "FRUIT";
  id: number;
  reportedEmail: string;
  reportedId: number;
  reporterEmail: string;
  reporterId: number;
  targetId: number;
}

// 신고 대상 조회할 때 사용
export interface Content {
  id: number;
  content: string; // 열매, 꽃 내용
  imageUrl: string; // 나무, 정원 나무 이미지
  name: string; // 나무 이름
  writerNickname: string; // 열매, 꽃 작성자 아이디
}