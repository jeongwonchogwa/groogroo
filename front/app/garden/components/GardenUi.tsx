"use client";

import GardenFooter from "./GardenFooter";
import GardenHeader from "./GardenHeader";

const GardenUi = () => {
  return (
    <div className="absolute flex flex-col w-screen h-screen z-50 p-5 justify-between">
      <GardenHeader />
      <GardenFooter />
    </div>
  );
};

export default GardenUi;
