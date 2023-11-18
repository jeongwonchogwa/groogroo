"use client";

import HomeHeader from "./components/HomeHeader";
import "../../app/home/styles/globals.css";
import { useEffect, useState } from "react";
const HomeLayout = ({ children }: any) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const handlemenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // 뷰포트 높이 설정 함수
  function setScreenSize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  useEffect(() => {
    setScreenSize();
    window.addEventListener("resize", setScreenSize);

    // 컴포넌트가 언마운트되거나 리사이즈 이벤트 리스너가 필요 없을 때 정리
    return () => {
      window.removeEventListener("resize", setScreenSize);
    };
  }, []);

  // console.log(document.documentElement.style.getPropertyValue("--vh"));
  return (
    <div className="min-w-[350px] max-w-[450px] bg-background-pixel bg-cover h-screen mx-auto">
      <HomeHeader handlemenu={() => handlemenu()} menuOpen={menuOpen} />
      {children}
    </div>
  );
};

export default HomeLayout;
