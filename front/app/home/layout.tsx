import HomeHeader from "./components/HomeHeader";

const HomeLayout = ({ children }: any) => {
  return (
    <div className="w-screen h-screen bg-background-pixel bg-cover">
      <HomeHeader />
      {children}
    </div>
  );
};

export default HomeLayout;
