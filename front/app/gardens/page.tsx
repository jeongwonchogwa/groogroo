import GardensHeader from "./components/GardensHeader";
import GardensSummary from "./components/GardenCard";

const GardensPage = () => {
  return (
    <div className=" overflow-auto w-screen h-screen bg-background-pixel bg-blend-overlay bg-slate-300 bg-opacity-25 bg-cover">
      <GardensHeader />
      <div className="mb-5">
        <div className="flex w-full h-full flex-col">
          <GardensSummary />
        </div>
      </div>
    </div>
  );
};

export default GardensPage;
