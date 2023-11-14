import React, { useState, MouseEvent } from 'react';

interface PixelCanvasProps {
  selectedTool: string;
  selectedColor: string;
}

const PixelCanvas = ({ selectedTool, selectedColor }: PixelCanvasProps) => {
  const [grid, setGrid] = useState<string[][]>(Array.from({ length: 16 }, () => Array(16).fill('white')));
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  const handleCellClick = (row: number, col: number) => {
    const newGrid = [...grid];
    if (selectedTool === 'pen') {
      newGrid[row][col] = selectedColor;
    } else {
      newGrid[row][col] = 'white';
    }
    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseDown = (row: number, col: number) => {
    setIsMouseDown(true);
    handleCellClick(row, col);
  };
  
  const handleMouseOver = (row: number, col: number) => {
    if (isMouseDown) {
      handleCellClick(row, col);
    }
  };

  // 마우스가 캔버스 밖으로 벗어나면 isMouseDown false로 변경
  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  return (
    <div className="flex flex-col justify-center" onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp}>
    {grid.map((row, rowIndex) => (
      <div key={rowIndex} className="flex">
        {row.map((col, colIndex) => (
          <div
            key={colIndex}
            className="w-4 h-4 border border-gray-300 cursor-pointer"
            style={{ backgroundColor: col }}
            onClick={() => handleCellClick(rowIndex, colIndex)}
            onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
            onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
          />
        ))}
      </div>
    ))}
  </div>
  );
};

export default PixelCanvas;
