import React from 'react';

// ContentInput 컴포넌트에 전달되는 속성들
interface ContentInputProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; // 변경: input 대신 textarea에 대한 이벤트 타입을 사용합니다.
}

const ContentInput: React.FC<ContentInputProps> = ({ placeholder, value, onChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // 입력값 변경 이벤트를 부모 컴포넌트로 전달
    onChange(e);
  };

  return (
    <div>
      <div className="w-full mt-1">
        <textarea // textarea 엘리먼트로 변경
          className="w-full text-gray-800 font-nexonGothic text-xl p-2 placeholder-center resize-y"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          style={{ resize: "none", outline: 'none' }}
					rows={5}
        />
      </div>
    </div>
  );
};

export default ContentInput;