import React, { useState, useRef  } from 'react';

type DrawingToolsProps = {
  onSelectTool: (tool: string) => void;
  onColorChange: (color: string) => void;
};

const DrawingTools: React.FC<DrawingToolsProps> = ({ onSelectTool, onColorChange }) => {
  const [selectedColor, setSelectedColor] = useState('black');
	const colorInputRef = useRef<HTMLInputElement | null>(null);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onColorChange(color);
  };

	const handleColorPickerClick = () => {
    if (colorInputRef.current) {
      colorInputRef.current.click();
    }
  };

  return (
    <div className="drawing-tools flex items-center space-x-2 mb-2">
      <button className="text-2xl text-black border-0" onClick={() => onSelectTool('pen')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<span role="img" aria-label="Pen Tool">✒️</span>
			</button>
			<button className="text-2xl text-black border-0" onClick={() => onSelectTool('eraser')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<span role="img" aria-label="Eraser Tool">🧹</span>
			</button>
      <div className="color-picker" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: selectedColor, border: '2px solid black', cursor: 'pointer' }} onClick={handleColorPickerClick}>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => handleColorChange(e.target.value)}
          ref={colorInputRef}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}

export default DrawingTools;
