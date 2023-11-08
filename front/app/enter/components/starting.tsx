"use client"

import Button from "../../components/Button";
import Image from 'next/image';



const Starting = () => {
	
  const handleKakaoLogin = () => {
    console.log('버튼눌린다')
    
  };

  return (
    <div className="w-full flex justify-center items-center">    
      <div className="w-full flex flex-col items-center mt-20 mx-10">
        <Image
          src="/assets/images/groogroo_logo.png"
          alt="Logo"
          width={300}
          height={120}
          className="my-10"
        />        
				<p className="font-nexonGothic font-bold text-[22px] mb-24">
          함께 만들어가는 우리의 정원
        </p>
				<div className="w-[90%] space-y-4 mt-32 mb-4">
					<Button color="secondary" label="카카오톡 로그인" onClick={handleKakaoLogin}/>
					<Button color="white" label="구글 로그인"/>
					<Button color="primary" label="네이버 로그인"/>
				</div>
			</div>
		</div>
  );
;}

export default Starting;
