import CreateFruit from "./garden/[gardenId]/components/CreateFruit"
import CreateFlower from "./garden/[gardenId]/components/CreateFlower"

const EneterPage = () => {
  return (
    <div className="w-full h-full">
      <div className="mx-5 mb-8">
        <CreateFlower />
      </div>
    </div>
  );
};

export default EneterPage;