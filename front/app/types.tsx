export interface Fruit {
  id: number;
  writerId: number;
  writerNickname: string;
  content: string;
  imageUrl: string;
  createTime: string;
}

export interface Tree {
  id: number;
  imageUrl: string;
  name: string;
  fruits: Fruit[];
  fruitsCount: number;
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
  targetId?: number;
  url?: string;
  role?: string;
  x?: number;
  y?: number;
  imageUrl?: string;
  capacity: number;
  memberCnt?: number;
  likes?: number;
}

export interface Report {
  content: string;
  contentType: "TREE" | "GARDEN" | "FLOWER" | "FRUIT";
  targetId: number;
}
