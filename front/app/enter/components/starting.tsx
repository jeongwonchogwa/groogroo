"use client"

import Button from "../../components/Button";
import Image from 'next/image';



const Starting = () => {
	
  const handleKakaoLogin = () => {
    console.log('버튼눌린다')
    
  };

  return (
    <div
      className="w-[430px] h-[932px] bg-cover bg-center bg-no-repeat relative flex justify-center items-center"
      style={{ backgroundImage: 'url("/assets/images/background_home.png")' }}
    >    
      <div className="w-[350px] h-[660px] absolute top-[480px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <Image src="/assets/images/groogroo_logo.png" alt="Logo" className="w-[300px] h-[120px] mb-[20px]" />
				<p className="font-nexonGothic font-bold text-[22px]">
        함께 만들어가는 우리의 정원
      	</p>
				<div className="w-[350px] h-[200px] border border-1 mt-[240px] space-y-4">
					<Button color="secondary" label="카카오톡 로그인" onClick={handleKakaoLogin}/>
					<Button color="white" label="구글 로그인"/>
					<Button color="primary" label="네이버 로그인"/>
				</div>
			</div>
		</div>
  );
;}

export default Starting;
