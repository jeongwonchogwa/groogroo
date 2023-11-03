"use client"

import React, { useState } from 'react';
import Button from "../../components/Button";
import { useRouter } from "next/navigation";



// 이걸,, 지금은 imageCount를 직접넣는데
// 자동으로 파일내에 파일갯수를 파악해주는 코드를짜야할까......?
// 우리 이미지 자동저장 이런것도없는데 굳이...??????????????? ㅠㅠㅠ....
const imageCount = 4;

const Freeset = () => {
	const [currentImage, setCurrentImage] = useState(0);

	const prevImage = () => {
		setCurrentImage((prev) => (prev -1 + imageCount) % imageCount);
	}

	const nextImage = () => {
		setCurrentImage((prev) => (prev +1) % imageCount);
	}

	const router = useRouter();

	const handlePickButtonClick = () => {
		router.push(`/enter/check?selectedImage=${currentImage}`);
	};

  return (
    <div
      className="w-[430px] h-[932px] bg-cover bg-center bg-no-repeat relative flex justify-center items-center"
      style={{ backgroundImage: 'url("/assets/images/background_home.png")' }}
    >    
      <div className="w-[390px] h-[720px] absolute top-[430px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="w-[390px] h-[110px] flex flex-col items-center">
          <p className="font-bitBit text-[48px]" style={{ marginBottom: 0 }}>
            나무 프리셋
          </p>
          <p className="font-nexonGothic text-[18px]" style={{ marginBottom: 0 }}>
            제공된 프리셋을 통해 나무를 골라주세요!
          </p>
        </div>
        <div className="w-[390px] h-[500px] flex flex-row justify-center">
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
								<img
								src={`/assets/trees/tree[${currentImage}].svg`}
								alt = "나무 이미지"
								style ={{
									width: '256px',
									height: '256px',
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

export default Freeset;
