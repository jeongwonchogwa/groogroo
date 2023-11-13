"use client";

import HomeHeader from "../home/components/HomeHeader";
import { useState } from "react";
const SearchLayout = ({ children }: any) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const handlemenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className="w-screen h-screen bg-background-pixel bg-cover">
      <HomeHeader handlemenu={() => handlemenu()} menuOpen={menuOpen} />
      {children}
    </div>
  );
};

export default SearchLayout;
