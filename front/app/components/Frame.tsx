interface FrameProps {
  height?: number;
  width?: number;
  content: React.ReactNode;
}

//todo. 이친구는 도대체 어따 쓰이는지..
const Frame = ({ height = 50, width = 5, content }: FrameProps) => {
  const heightProp = `h-[${height}px]`;
  const widthProp = `w-[${width}px]`;

  return (
    <div className="w-full flex flex-row">
      <div className="my-auto">
        <div className={`${widthProp} ${heightProp} bg-black`} />
      </div>
      <div className="w-full flex flex-col">
        <div className="w-full h-[5px] bg-black"></div>
        <div className={`w-full ${heightProp}`}>{content}</div>
        <div className="w-full h-[5px] bg-black"></div>
      </div>
      <div className="my-auto">
        <div className={`${widthProp} ${heightProp} bg-black`} />
      </div>
    </div>
  );
};

export default Frame;
