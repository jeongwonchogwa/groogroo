"use client";

const Grid = () => {
  console.log(window.innerHeight);
  return (
    <div className="bg-black bg-opacity-10 absolute flex flex-col w-screen h-screen z-50 top-[-8px]">
      {[...Array(20)].map((index) => (
        <div className="flex flex-grow" key={index}>
          {[...Array(30)].map((index) => (
            <div
              className="border-[0.5px] border-gray-400 border-dashed flex flex-grow after:pb-[100%]"
              key={index}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
