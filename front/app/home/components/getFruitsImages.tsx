import fs from "fs";
import path from "path";

// 이미지 파일 목록을 가져오는 함수, 얜 서버사이드에서 실행
const getFruitImages = () => {
  const fruitsDir = path.join(process.cwd(), "public", "assets", "fruits");
  return fs
    .readdirSync(fruitsDir)
    .filter((file) => /\.(jpg|jpeg|png|gif)$/.test(file));
};

export default getFruitImages;
