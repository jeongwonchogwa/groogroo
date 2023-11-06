interface FrameProps {
  height?: number;
  width?: number;
  content: React.ReactNode;
}

//todo. 이친구는 도대체 어따 쓰이는지..
const Frame = ({ height = 50, width = 5, content }: FrameProps) => {
  const heightProp = `h-[${height}px]`;
  const widthProp = `w-[${width}px]`;

  const topBottomBorder = `${widthProp} ${heightProp} bg-frame-border`;
  const contentContainer = `w-full ${heightProp}`;

  return (
    <div className="w-full flex flex-row h-full">
      {/* topBorder */}
      <div className="my-auto">
        <div className={topBottomBorder} />
      </div>
      <div className="w-full flex flex-col">
        {/* leftBorder */}
        <div className="w-full h-[5px] bg-frame-border"></div>
        <div className={contentContainer}>{content}</div>
        {/* rightBorder */}
        <div className="w-full h-[5px] bg-frame-border"></div>
      </div>
      {/* bottomBorder */}
      <div className="my-auto">
        <div className={topBottomBorder} />
      </div>
    </div>
  );
};

export default Frame;
