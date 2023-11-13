"use client"

import Button from "../../components/Button";
import NameInput from "../../components/NameInput";

import React, { useState, ChangeEvent } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import Image from 'next/image';

import { userInfoStore } from '../../../stores/userInfoStore';

const Check = () => {

	const getUserToken = () => {
		const { userToken } = userInfoStore.getState();
		return userToken;
	}
	const AccessToken = getUserToken();

	// const AccessToken = localStorage.getItem("access_token");

	const router = useRouter();

	const search = useSearchParams();
	const selectedImageUrl = search?.get("selectedImageUrl")

	const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('닉네임은 12글자까지 가능합니다');
  const [messageColor, setMessageColor] = useState('text-primary');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleCheckDuplicate = async () => {
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
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/tree/check/${nickname}`,{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				const data = await res.json();
				console.log(data)

				if (data.result) {
					setMessage('중복된 닉네임입니다');
					setMessageColor('text-error');
				} else {
					setMessage('사용 가능한 닉네임입니다');
					setMessageColor('text-success');
				}

		} catch (err) {
			console.log(err);
		}
		}
	};

	const handleReselctButtonClick = () => {
    window.history.back()
  };

	const handleStart = async () => {
		if (message === '사용 가능한 닉네임입니다') {
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/tree`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${AccessToken}`,
					},
					body: JSON.stringify({
						imageUrl: selectedImageUrl,
						name: inputValue,
					}),
				});
				const data = await res.json();
				console.log("가자로그인")
				console.log(data)
				router.push('/home');
			} catch (err) {
				console.log(err);
			}
			// 사용가능한 닉네임일 경우 다음 페이지로 라우팅
		} else {
			// 닉네임 중복 확인 메시지를 업데이트
			setMessage('닉네임 중복 확인 해주세요');
			setMessageColor('text-error');
		}
	};

  return (
    <div className="w-full flex flex-col justify-center items-center ">    
      <div className="w-full flex flex-col items-center mt-20">
        <div className="flex flex-col items-center mb-3">
          <p className="font-bitBit text-[32px]" style={{ marginBottom: 0 }}>
            아래 나무로 시작할까요?
          </p>
        </div>
        <div className="h-[300px] flex justify-center">
          <div className="w-[290px] flex flex-row mr-[15px] ml-[5px]">
						<div className="my-auto">
							<div className="w-[5px] h-[290px] bg-black" />
						</div>
						<div className="w-[290px] flex flex-col">
							<div className="w-[290px] h-[5px] bg-black"></div>
							<div className="w-[290px] h-[290px] flex items-center justify-center bg-white">
							{selectedImageUrl && (
								<Image
									src={selectedImageUrl}
									alt="나무 이미지"
									width={192}
									height={192}
									style={{
										objectFit: 'cover',
									}}
								/>
							)}
							</div>
							<div className="w-[290px] h-[5px] bg-black"></div>
						</div>
						<div className="my-auto">
							<div className="w-[5px] h-[290px] bg-black" />
						</div>
					</div>
        </div>
				<NameInput placeholder="닉네임을 입력하세요" value={inputValue} maxlength={12} onChange={handleInputChange} ></NameInput>
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