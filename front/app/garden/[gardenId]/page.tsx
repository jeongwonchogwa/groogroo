import dynamic from "next/dynamic";

const GardenCSR = dynamic(() => import("./components/GardenPhaser"), {
  ssr: false,
});

const GardenPage = ({ params }: { params: { gardenId: string } }) => {
  return (
    <div className="w-screen h-screen">
      <GardenCSR gardenId={Number(params.gardenId)} />
    </div>
  );
};

export default GardenPage;
