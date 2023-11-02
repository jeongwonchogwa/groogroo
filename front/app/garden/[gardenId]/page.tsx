import dynamic from "next/dynamic";
import Garden from "./components/Garden";

const GardenCSR = dynamic(() => import("./components/Garden"), { ssr: false });

const gardenPage = () => {
  return (
    <div className="w-screen h-screen">
      <GardenCSR />
    </div>
  );
};

export default gardenPage;
