"use client";

import HomeHeader from "../home/components/HomeHeader";
import { useState } from "react";
const SearchLayout = ({ children }: any) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const handlemenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className="min-w-[350px] max-w-[450px] h-screen bg-background-pixel bg-cover mx-auto">
      <HomeHeader handlemenu={() => handlemenu()} menuOpen={menuOpen} />
      {children}
    </div>
  );
};

export default SearchLayout;
