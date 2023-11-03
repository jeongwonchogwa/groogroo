import React from 'react';

// Props로 받아올 변수들
interface NameInputProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NameInput: React.FC<NameInputProps> = ({ placeholder, value, onChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // 입력값이 12글자를 초과하면 더 이상 타이핑 허용하지 않음
    if (inputValue.length <= 12) {
      onChange(e); // 입력값이 변경될 때 onChange 핸들러를 호출하여 부모 컴포넌트에서 업데이트합니다.
    }
  };

  return (
    <div>
      <div className="w-full mt-1">
        <input
          type="text"
          className="w-full mt-auto text-gray-800 text-2xl font-bitBit p-2 placeholder-center"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          style={{ outline: 'none' }}
        />
      </div>
    </div>
  );
};

export default NameInput;