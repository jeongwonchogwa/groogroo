"use client"

import Button from "../../components/Button";
import SmallButton from "../../components/SmallButton";
import NameInput from "../../components/NameInput";
import Canvas from "./canvas";
import DrawingTools from "./DrawingTools";

import React, { useState, ChangeEvent } from 'react';
import { useRouter } from "next/navigation";
import { UrlObject } from 'url';


const Create = () => {
	const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [selectedComponent, setSelectedComponent] = useState('canvas');
  const [selectedTool, setSelectedTool] = useState('pen'); // 기본 도구를 'pen'으로 설정
  const [selectedColor, setSelectedColor] = useState('black'); // 기본 색상을 'black'으로 설정

  const handleCreateButtonClick = () => {
    if (selectedComponent === 'canvas') {
      // 임시로 만들어서 route      
      router.push('/enter/pick');
    } else if (selectedComponent === 'text') {
      if (inputValue.trim() === '') {
        // inputValue가 비어있는 경우 알림 표시
        alert('텍스트를 입력하세요');
      } else {
        fetchTextToFlask(inputValue);
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSelectTool = (tool: string) => {
    setSelectedTool(tool); // 선택한 도구를 업데이트
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color); // 선택한 색상을 업데이트
  };

  const fetchTextToFlask = async (inputData : string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_GROOGROO_FLASK_API_URL}/image`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: inputData })
      });

      if (response.status === 200) {
        // image_data - 형식은 base64
        const responseData = await response.json();
        // console.log(responseData.image_url)
        // router.push(`/enter/pick/${responseData.image_url}`)
        console.log(responseData.image_data);

      } else {
        console.log('Server Response Error:', response.status);
      }
    } catch (error) {
      console.log('요청실패:', error);
    }
  };


  return (
    <div className="w-full flex flex-col justify-center items-center ">    
      <div className="w-full flex flex-col items-center mt-20">
        <p className="font-bitBit text-[48px]" style={{ marginBottom: 0 }}>
          내 나무 만들기
        </p>
        <p className="font-nexonGothic text-[18px]" style={{ marginBottom: 0 }}>
          AI 처리를 통해 나만의 나무를 만들 수 있답니다!
        </p>
      </div>
      <div className="w-full flex flex-col items-center">
        <div className="w-full flex space-x-8 mt-5 mb-3">
          <SmallButton color={selectedComponent === 'canvas' ? 'default' : 'white'} label="이미지" onClick={() => setSelectedComponent('canvas')} />
          <SmallButton color={selectedComponent === 'text' ? 'default' : 'white'} label="텍스트" onClick={() => setSelectedComponent('text')} /> 
        </div>
        {selectedComponent === 'canvas' && (
          <>
            <DrawingTools
              onSelectTool={(tool) => handleSelectTool(tool)}
              onColorChange={(color) => handleColorChange(color)}
            />
          <Canvas selectedTool={selectedTool} selectedColor={selectedColor} />
          </>
        )}        
        {selectedComponent === 'text' && <NameInput placeholder="뿡뿡이나무" value={inputValue} onChange={handleInputChange} />} { /* NameInput 컴포넌트를 렌더링 */ }    
        <div className="w-full h-[20px] flex justify-end mr-20">
          <a href="/enter/freeset" className="text-primary font-nexonGothic font-bold text-[20px] hover:no-underline hover:text-primary">				
            나무 프리셋 구경하기
          </a>
        </div>
        <div className="w-[80%] mt-[30px] ">      
          <Button color="primary" label="생성 하기" onClick={handleCreateButtonClick} />
        </div>
      </div>
		</div>
  );
;}

export default Create;
