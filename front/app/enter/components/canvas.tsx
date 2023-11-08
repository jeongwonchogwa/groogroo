import React, { useRef, useEffect, useState } from 'react';

const Canvas: React.FC<{ selectedTool: string; selectedColor: string }> = ({ selectedTool, selectedColor }) => {  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prevX, setPrevX] = useState(0);
  const [prevY, setPrevY] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // 기본값 설정 (selectedTool에 따라 적절한 색상 설정)
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (selectedTool === 'pen') {
          ctx.strokeStyle = selectedColor; // Pen 도구 선택 시 선택한 색상 사용
					ctx.lineWidth = 2;
        } else if (selectedTool === 'eraser') {
          ctx.strokeStyle = 'white'; // Eraser 도구 선택 시 흰색 사용
					ctx.lineWidth = 10;
        }
      }
    }
  }, [selectedTool, selectedColor]);

  const getCanvasCoordinates = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (event.clientX - rect.left) * scaleX;
      const y = (event.clientY - rect.top) * scaleY;
      return { x, y };
    }
    return { x: 0, y: 0 };
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoordinates(event);
    setIsDrawing(true);
    setPrevX(x);
    setPrevY(y);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const { x, y } = getCanvasCoordinates(event);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
        setPrevX(x);
        setPrevY(y);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full flex flex-row mx-11">
        <div className="my-auto">
          <div className="w-[5px] h-[290px] bg-black" />
        </div>
        <div className="w-full flex flex-col">
          <div className="w-full h-[5px] bg-black"></div>
          <canvas
            className="w-full h-[290px] flex items-center justify-center bg-white"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            ref={canvasRef}
          />
          <div className="w-full h-[5px] bg-black"></div>
        </div>
        <div className="my-auto">
          <div className="w-[5px] h-[290px] bg-black" />
        </div>
      </div>
    </div>
  );
};

export default Canvas;
