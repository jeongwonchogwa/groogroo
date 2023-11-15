"use client"

import React, { useState, useEffect } from 'react';
import Button from "../../components/Button";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { userInfoStore } from '../../../stores/userInfoStore';


const Preset = () => {

  const getUserToken = () => {
		const { userToken } = userInfoStore.getState();
		return userToken;
	}
	const AccessToken = getUserToken();

	// const AccessToken = localStorage.getItem("access_token");
	const [imageCount, setImageCount] = useState(8);
	const [currentImage, setCurrentImage] = useState(0);
	const [treePresets, setTreePresets] = useState<{ treeUserPresetId: number; imageUrl: string }[]>([]);

	const prevImage = () => {
		setCurrentImage((prev) => (prev -1 + imageCount) % imageCount);
	}

	const nextImage = () => {
		setCurrentImage((prev) => (prev +1) % imageCount);
	}

	const router = useRouter();

	const handlePickButtonClick = () => {
		router.push(`/enter/check?selectedImageUrl=${treePresets[currentImage]?.imageUrl}`);
	};

	useEffect(() => {
		const fetchTreePresets = async () => {
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/tree/preset`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${AccessToken}`
					},
				});
				const data = await res.json();
				setTreePresets(data.presets);
				setImageCount(data.presets.length);
				console.log(AccessToken)
				console.log(data.presets)
			} catch (error) {
				console.error('프리셋 조회 중 오류 발생:', error)
			}
		};

		fetchTreePresets();
	}, []);

  return (
    <div className="w-full flex flex-col justify-center items-center ">    
      <div className="w-full flex flex-col items-center mt-20">
        <div className="flex flex-col items-center mb-3">
          <p className="font-bitBit text-[48px]" style={{ marginBottom: 0 }}>
            나무 프리셋
          </p>
          <p className="font-nexonGothic text-[18px]" style={{ marginBottom: 0 }}>
            제공된 프리셋을 통해 나무를 골라주세요!
          </p>
        </div>
        <div className="h-[500px] flex flex-row justify-center">
					<div className="w-[35px] h-[500px] flex items-center justify-center">
						<button
							onClick={prevImage}
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
								<Image
								src={treePresets[currentImage]?.imageUrl}
								alt = "나무 이미지"
								width={256}
          			height={256}
								style ={{
									objectFit: 'cover',
								}} />
							</div>
							<div className="w-[290px] h-[5px] bg-black"></div>
						</div>
						<div className="my-auto">
							<div className="w-[5px] h-[490px] bg-black" />
						</div>
					</div>
					<div className="w-[35px] h-[500px] flex items-center justify-center">
						<button
							onClick={nextImage}
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
						내 나무 직접 그리기
					</a>
				</div>
        <div className="w-[290px] h-[60px] mt-[30px] ">
          <Button color="primary" label="선택 하기" onClick={handlePickButtonClick}/>
        </div>
      </div>
		</div>
  );
;}

export default Preset;
