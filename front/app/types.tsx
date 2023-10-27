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
}

export interface TreesResponse {
  httpStatus: string;
  message: string;
  trees: Tree[];
}
