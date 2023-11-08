"use client"

import Button from "../../components/Button";
import NameInput from "../../components/NameInput";
import Frame from "../../components/Frame";

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import Image from 'next/image';

const Check = () => {
	const router = useRouter();

	const search = useSearchParams();
	const selectedImage = search?.get("selectedImage")

	const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('닉네임은 12글자까지 가능합니다');
  const [messageColor, setMessageColor] = useState('text-primary');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleCheckDuplicate = () => {
		// 입력된 닉네임
		const nickname = inputValue;
	
		// 정규표현식을 사용하여 유효성 검사
		const isValid = /^[가-힣A-Za-z0-9\s]+$/.test(nickname);
	
		if (!isValid) {
			// 입력된 닉네임이 유효하지 않은 경우
			setMessage('한글, 영어, 숫자, 띄어쓰기만 허용됩니다.');
			setMessageColor('text-error');
		} else {
			// 입력된 닉네임이 유효한 경우, 서버로 중복 확인 요청을 보냅니다.
			// 중복 여부에 따라 아래의 setMessage와 setMessageColor를 업데이트할 수 있습니다.
			const isDuplicate = true; // 예시: 중복된 닉네임인 경우
	
			if (isDuplicate) {
				setMessage('중복된 닉네임입니다');
				setMessageColor('text-error');
			} else {
				setMessage('사용가능한 닉네임입니다');
				setMessageColor('text-success');
			}
		}
	};

	const handleReselctButtonClick = () => {
    window.history.back()
  };

	const handleStart = () => {
		if (message === '사용가능한 닉네임입니다') {
			// 사용가능한 닉네임일 경우 다음 페이지로 라우팅
		} else {
			// 닉네임 중복 확인 메시지를 업데이트
			setMessage('닉네임 중복 확인 해주세요');
			setMessageColor('text-error');
		}
	};

  return (
    <div
      className="w-[430px] h-[932px] bg-cover bg-center bg-no-repeat relative flex justify-center items-center"
      style={{ backgroundImage: 'url("/assets/images/background_home.png")' }}
    >    
      <div className="w-[390px] h-[720px] absolute top-[430px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="w-[390px] h-[80px] flex flex-col items-center">
          <p className="font-bitBit text-[32px]" style={{ marginBottom: 0 }}>
            아래 나무로 시작할까요?
          </p>
        </div>
        <div className="w-[390px] h-[300px] flex justify-center">
          <div className="w-[290px] flex flex-row mr-[15px] ml-[5px]">
						<div className="my-auto">
							<div className="w-[5px] h-[290px] bg-black" />
						</div>
						<div className="w-[290px] flex flex-col">
							<div className="w-[290px] h-[5px] bg-black"></div>
							<div className="w-[290px] h-[290px] flex items-center justify-center bg-white">
							<Image
								src={`/assets/trees/tree[${selectedImage}].svg`}
								alt="나무 이미지"
								style={{
									height: '192px',
									objectFit: 'cover',
								}}
							/>
							</div>
							<div className="w-[290px] h-[5px] bg-black"></div>
						</div>
						<div className="my-auto">
							<div className="w-[5px] h-[290px] bg-black" />
						</div>
					</div>
        </div>
				<NameInput placeholder="닉네임을 입력하세요" value={inputValue} onChange={handleInputChange} ></NameInput>
				<div className="w-[290px] h-[20px] flex justify-start">
          <p className={`${messageColor} font-nexonGothic font-bold text-[16px]`}>				
						{message}
					</p>
				</div>							
				<div className="w-[290px] h-[50px] mt-[30px]">      
          <Button color="default" label="중복 확인" onClick={handleCheckDuplicate}/>
        </div>
        <div className="w-[290px] h-[50px] mt-[25px]">      
          <Button color="secondary" label="다시 선택 하기" onClick={handleReselctButtonClick}/>
        </div>
        <div className="w-[290px] h-[50px] mt-[25px]">      
          <Button color="white" label="시작하기" onClick={handleStart}/>
        </div>
      </div>
		</div>
  );
;}

export default Check;