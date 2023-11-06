import React, { useState } from "react";

//Props로 받아올 변수들
interface NameInputProps {
  placeholder: string;
  value: string; // 추가: value 프로퍼티
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // 추가: onChange 프로퍼티
  maxlength?: number;
}

const NameInput: React.FC<NameInputProps> = ({ placeholder, value, onChange, maxlength }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 입력값이 12글자를 초과하면 더 이상 타이핑 허용하지 않음
    if (value.length <= 12) {
      setInputValue(value);
    }
  };

  return (
    <div>
      <div className="w-[300px] flex flex-row mt-[20px]">
        <div className="my-auto">
          <div className="w-[5px] h-[50px] bg-black" />
        </div>
        <div className="w-[290px] flex flex-col">
          <div className="w-[290px] h-[5px] bg-black"></div>
          <div className="w-[290px] h-[50px]">
            <input
              type="text"
              maxLength={maxlength}
              className="w-[290px] h-[50px] text-gray-800 text-lg font-bitBit p-2 placeholder-center"
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              style={{ outline: "none" }}
            />
            <style>
              {`
							.placeholder-center::placeholder {
								text-align: center;
								line-height: 210px;
							}
						`}
            </style>
          </div>
          <div className="w-[290px] h-[5px] bg-black"></div>
        </div>
        <div className="my-auto">
          <div className="w-[5px] h-[50px] bg-black" />
        </div>
      </div>
    </div>
  );
};

export default NameInput;
