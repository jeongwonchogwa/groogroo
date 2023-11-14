import React, { useState } from 'react';

interface PixelCanvasProps {
  selectedTool: string;
  selectedColor: string;
  checkIsBlank: (isBlank: boolean) => void;
}

const PixelCanvas = ({ selectedTool, selectedColor, checkIsBlank }: PixelCanvasProps) => {
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
    checkBlank();
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

  // 백지인지 확인
  const checkBlank = () => {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] !== 'white') {
          checkIsBlank(false);
          return;
        }
      }
    }
    checkIsBlank(true);
  };

  return (
    <div className="flex flex-col justify-center" onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp}>
      <div id="pixel-grid">
    {grid.map((row, rowIndex) => (
      <div key={rowIndex} className="flex">
        {row.map((col, colIndex) => (
          <div
            key={colIndex}
            className="w-4 h-4 cursor-pointer"
            style={{ backgroundColor: col }}
            onClick={() => handleCellClick(rowIndex, colIndex)}
            onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
            onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
          />
        ))}
      </div>
    ))}
    </div>
  </div>
  );
};

export default PixelCanvas;
