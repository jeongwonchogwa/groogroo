import HomeFooter from "./components/HomeFooter";
import TreeContainer from "./components/TreeContainer";

const HomePage = () => {
  return (
    <div className="w-full h-full">
      <div className="mx-5 mb-8">
        <TreeContainer />
      </div>
      <div>
        <HomeFooter />
      </div>
    </div>
  );
};

export default HomePage;
