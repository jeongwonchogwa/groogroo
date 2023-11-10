import dynamic from "next/dynamic";
import Garden from "./components/Garden";
import { useParams, useSearchParams } from "next/navigation";

const GardenCSR = dynamic(() => import("./components/Garden"), { ssr: false });

const GardenPage = ({ params }: { params: { gardenId: string } }) => {
  return (
    <div className="w-screen h-screen">
      <GardenCSR gardenId={Number(params.gardenId)} />
    </div>
  );
};

export default GardenPage;
