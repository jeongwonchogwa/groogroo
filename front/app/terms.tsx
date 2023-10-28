"use client"

// 1. 이미지 url 수정해야함
// 2. 약관동의 체크박스 css 수정해야함
// 3. 버튼누르면 다음페이지로 라우팅되게 해야함

import React, { useState } from "react";
import Button from "./components/Button";

export default function Home() {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleButtonClick = () => {
    if (isChecked) {
      // 체크박스가 체크되어 있을 때 버튼 동작
      // 이 부분에 버튼 클릭 시 실행할 동작을 추가하세요.
      console.log("버튼이 클릭되었습니다.");
    }
  };

  return (
    <div
      className="w-[430px] h-[932px] bg-cover bg-center bg-no-repeat relative flex justify-center items-center"
      style={{ backgroundImage: 'url("/assets/background_home.png")' }}
    >      
      <div className="w-[350px] h-[720px] absolute top-[430px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <img src="/assets/groogroo_logo.png" alt="Logo" className="w-[240px] h-[90px] mb-[20px]" />
        <div className="w-[350px] flex flex-row">
          <div className="my-auto">
            <div className="w-[5px] h-[450px] bg-black" />
          </div>
          <div className="w-[340px] flex flex-col">
            <div className="w-[340px] h-[5px] bg-black"></div>
            <div className="w-[340px]">
              <div className="w-[340px] h-[450px] bg-primary border border-black flex flex-col items-center">
                <p className="text-white font-nexonGothic font-bold text-[32px] mt-5 mb-5">그루그루 이용약관</p>
                <p className="text-white text-[20px] ml-2 mr-2">
                  1. 다른 회원의 계정 및 비밀번호를 &nbsp;&nbsp;&nbsp;도용하면 안 돼요. <br/>
                  2. 타인의 명예를 손상시키는 행위 &nbsp;&nbsp;&nbsp;는 안 돼요. <br/>
                  3. 공공질서에 위반되는 내용 작성 &nbsp;&nbsp;&nbsp;은 안 돼요. <br/>
                  4. 회사 또는 제3자의 저작권 등 &nbsp;&nbsp;&nbsp;권리를 침해하는 행위는 안 돼요. <br/>
                  5. 다른 회원의 개인정보를 수집, &nbsp;&nbsp;&nbsp;저장, 공개하는 행위는 안 돼요. <br/>
                  6. 기타 불법한 행위는 안 돼요.
                </p>
              </div>
            </div>
            <div className="w-[340px] h-[5px] bg-black"></div>
          </div>
          <div className="my-auto">
            <div className="w-[5px] h-[450px] bg-black" />
          </div>
        </div>
        <div className="mt-[25px] mb-[35px] flex items-center">
          <p className="font-nexonGothic font-bold text-[24px] my-auto">
            약관에 동의합니다.
          </p>
          <input 
            type="checkbox" 
            className="ml-4 w-[24px] h-[24px]"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
        </div>
        <Button color="primary" label="다음으로" disabled={!isChecked} />
      </div>
    </div>
  );
}