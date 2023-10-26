"use client";

import KakaoButton from "./components/KakaoButton";
import LinkCopyButton from "./components/LinkCopyButton";
// Todo. garden page 테스트 중
const GardenPage = () => {
  return (
    <div>
      <KakaoButton />
      <div className="w-5 h-5">
        <LinkCopyButton />
      </div>
    </div>
  );
};

export default GardenPage;
