import React, { useState, MouseEvent } from 'react';

interface PixelCanvasProps {
  selectedTool: string;
  selectedColor: string 
}

const PixelCanvas = ({selectedTool, selectedColor}:PixelCanvasProps) => {
  const [grid, setGrid] = useState<string[][]>(Array.from({ length: 16 }, () => Array(16).fill('white')));

  const handleCellClick = (row: number, col: number) => {
    const newGrid = [...grid];
    if(selectedTool == "pen"){
      newGrid[row][col] = selectedColor; // 색을 원하는 값으로 변경
    }else{
      newGrid[row][col] = "white";
    }
    
    setGrid(newGrid);
  };

  return (
    <div className="flex flex-col justify-center">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((col, colIndex) => (
            <div
              key={colIndex}
              className="w-4 h-4 border border-gray-300 cursor-pointer"
              style={{ backgroundColor: col }}
              onClick={(e: MouseEvent) => handleCellClick(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default PixelCanvas;