interface FrameProps {
  content: React.ReactNode;
}

const Frame = ({ content }: FrameProps) => {
  return (
    <div className="w-full flex flex-row">
      <div className="my-auto">
        <div className="w-[5px] h-[50px] bg-black" />
      </div>
      <div className="w-full flex flex-col">
        <div className="w-full h-[5px] bg-black"></div>
        <div className="w-full h-[50px]">{content}</div>
        <div className="w-full h-[5px] bg-black"></div>
      </div>
      <div className="my-auto">
        <div className="w-[5px] h-[50px] bg-black" />
      </div>
    </div>
  );
};

export default Frame;
