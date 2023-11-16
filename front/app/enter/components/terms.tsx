"use client"

// 2. 약관동의 체크박스 css 수정해야함

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../components/Button";
import Image from 'next/image';

export default function Terms() {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const router = useRouter();

  const handleButtonClick = () => {
    if (isChecked) {
      router.push('/enter/create');
      console.log("버튼이 클릭되었습니다.");
    }
  };

  return (
    <div className="w-full flex justify-center items-center">   
      <div className="flex flex-col items-center mt-20 mx-5">
        <Image src="/assets/images/groogroo_logo.png" alt="Logo" width={240} height={90} className="mb-[20px]" />
        <div className="w-full h-[440px] flex flex-row">
          <div className=" my-auto">
            <div className="w-[5px] h-[430px] bg-black" />
          </div>
          <div className="w-full flex flex-col">
            <div className="w-full h-[5px] bg-black"></div>
            <div className="w-full">
              <div className="w-full h-[430px] bg-primary border border-black flex flex-col items-center">
                <p className="text-white font-nexonGothic font-bold text-[32px] mt-5 mb-5">그루그루 이용약관</p>
                <p className="text-white font-nexonGothic text-[20px] ml-5 mr-5" style={{ lineHeight: '2.5' }}>
                  1. 타인의 계정을 도용하면 안 돼요. <br/>
                  2. 타인의 명예를 손상시키면 안 돼요. <br/>
                  3. 질서에 위반된 내용작성은 안 돼요. <br/>
                  4. 저작권 등 권리를 침해하면 안 돼요. <br/>
                  5. 타인의 개인정보 사용은 안 돼요. <br/>
                  6. 기타 불법한 행위는 안 돼요.
                </p>
              </div>
            </div>
            <div className="w-full h-[5px] bg-black"></div>
          </div>
          <div className="my-auto">
            <div className="w-[5px] h-[430px] bg-black" />
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
        <Button color="primary" label="다음으로" disabled={!isChecked} onClick={handleButtonClick}/>
      </div>
    </div>
  );
}
