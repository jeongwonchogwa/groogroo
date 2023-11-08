"use client"

import React, { useState } from 'react';
import Button from "../../components/Button";
import { useRouter } from "next/navigation";


const Pick = () => {
	
	const router = useRouter();

	const handlePickButtonClick = () => {
    router.push('/enter/check');
  };

  return (
		<div className="w-full flex flex-col justify-center items-center ">    
      <div className="w-full flex flex-col items-center mt-20">
        <div className="flex flex-col items-center mb-3">
					<p className="font-bitBit text-[48px]" style={{ marginBottom: 0 }}>
            내 나무 만들기
          </p>
          <p className="font-nexonGothic text-[18px]" style={{ marginBottom: 0 }}>
            AI를 통해 생성된 나무 목록입니다!
          </p>
        </div>
        <div className="h-[500px] flex flex-row justify-center">
					<div className="w-[35px] h-[500px] flex items-center justify-center">
						<button
							style={{
								backgroundImage: 'url("/assets/images/arrow.svg")',
								width: '24px',
								height: '48px',
								backgroundSize: 'cover',
								backgroundPosition: 'center',
								backgroundRepeat: 'no-repeat',
							}}
						></button>
					</div>
					<div className="w-[290px] flex flex-row mr-[15px] ml-[5px]">
						<div className="my-auto">
							<div className="w-[5px] h-[490px] bg-black" />
						</div>
						<div className="w-[290px] flex flex-col">
							<div className="w-[290px] h-[5px] bg-black"></div>
							<div className="w-[290px] h-[490px] flex items-center justify-center bg-white">
							</div>
							<div className="w-[290px] h-[5px] bg-black"></div>
						</div>
						<div className="my-auto">
							<div className="w-[5px] h-[490px] bg-black" />
						</div>
					</div>
					<div className="w-[35px] h-[500px] flex items-center justify-center">
						<button
							style={{
							backgroundImage: 'url("/assets/images/arrow_right.png")',
							width: '24px',
							height: '48px',
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							backgroundRepeat: 'no-repeat',
						}}
						></button>
					</div>
        </div>
				<div className="w-[290px] h-[20px] flex justify-end">
					<a href="/enter/create" className="text-primary font-nexonGothic font-bold text-[20px] hover:no-underline hover:text-primary">				
						다시 그리기
					</a>
				</div>
        <div className="w-[290px] h-[60px] mt-[30px] ">
          <Button color="primary" label="선택 하기" onClick={handlePickButtonClick}/>
        </div>
      </div>
		</div>
  );
;}

export default Pick;
