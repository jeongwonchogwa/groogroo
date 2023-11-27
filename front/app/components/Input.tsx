import React, { useState } from "react";

//Props로 받아올 변수들
interface InputProps {
  placeholder: string;
  purpose: "title" | "content" | "name";
}

const Input: React.FC<InputProps> = ({ placeholder, purpose }) => {
  const [text, setText] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setText(e.target.value);
  };

  // 각 purpose에 따른 스타일 설정
  const inputConfig: { [key in InputProps["purpose"]]: string } = {
    // Title 스타일 클래스명
    title:
      "w-[340px] h-[65px] text-gray-800 text-2xl font-nexonGothic-Bold p-2 placeholder-center",
    //content 스타일 클래스명
    content:
      "w-[340px] h-[230px] text-gray-800 text-lg font-nexonGothic-Bold p-2 placeholder-center resize-y",
    // Name 스타일 클래스명
    name: "w-[290px] h-[50px] text-gray-800 text-lg font-bitBit p-2 placeholder-center",
  };
  return (
    <div className="p-4">
      {/* content일때는 textarea, 나머지는 input 반환 */}
      {purpose === "content" ? (
        <textarea
          className={`${inputConfig[purpose]}`}
          placeholder={placeholder}
          value={text}
          onChange={handleInputChange}
          rows={4} // 자동 줄 바꿈을 위해 설정한 행 수
          style={{ resize: "none" }}
        />
      ) : (
        <input
          type="text"
          className={`${inputConfig[purpose]}`}
          placeholder={placeholder}
          value={text}
          onChange={handleInputChange}
        />
      )}
      {/* You enterd는text value가 잘들어오는지 확인을 위함. 추후 삭제할것 */}
      <p className="mt-2">You entered: {text}</p>
      <style>
        {`
          .placeholder-center::placeholder {
            text-align: center;
            line-height: 210px;
          }
        `}
      </style>
    </div>
  );
};

export default Input;
