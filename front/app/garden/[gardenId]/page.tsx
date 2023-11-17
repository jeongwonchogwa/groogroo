"use client"
import Button from "@/app/components/Button";
import { userInfoStore } from "@/stores/userInfoStore";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";

const GardenCSR = dynamic(() => import("./components/GardenPhaser"), {
  ssr: false,
});

const GardenPage = ({ params }: { params: { gardenId: string } }) => {


  const handleSocialLogin = (service: string) => {
    window.location.href = `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/oauth2/authorization/${service}`;
  };

  const { userToken, setApproachUrl } = userInfoStore();
  useEffect(() => {
    if(userToken == ""){
      setApproachUrl(params.gardenId)
    }
  }, [])
  

  return (
    <div className="w-screen h-screen">
      {userToken === "" ? (
        <div className={`w-full h-full flex flex-col items-center justify-center bg-white gap-5 px-10`}>
          <Image
            alt="logo"
            src={"/assets/images/groogroo_logo.png"}
            width={300}
            height={100}
          ></Image>
          <Button
            color="secondary"
            label="카카오톡 로그인"
            onClick={() => handleSocialLogin("kakao")}
          />
          <Button
            color="white"
            label="구글 로그인"
            onClick={() => handleSocialLogin("google")}
          />
        </div>
      ) : (
        <GardenCSR
          gardenId={Number(params.gardenId.slice(10, params.gardenId.length))}
        />
      )}
    </div>
  );
};

export default GardenPage;
