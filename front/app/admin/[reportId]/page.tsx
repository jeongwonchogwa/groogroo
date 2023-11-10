"use client";

import { useState, useEffect } from 'react';
import { Content } from  "@/app/types";
import { redirect } from "next/navigation";

const ReportDetailPage = () => {
  // const [userToken, setUserToken] = useState<string>("");
  const [content, setContent] = useState<Content>();
  const [certified, setCertified] = useState<boolean>(false);

  // useEffect(() => {
  //   // 세션 스토리지에서 userInfo 가져오기
  //   const userInfoString = sessionStorage.getItem('userInfo');
    
  //   if(userInfoString) {
  //       const userInfo = JSON.parse(userInfoString);
  //       setUserToken(userInfo.state.userToken);
  //   } else {
  //     redirect("/not-found");
  //   }
  // }, []);

  // useEffect(() => {
  //   const tokenParts = userToken.split(".");
  //       console.log(tokenParts[1]);
  //       const decodedToken = JSON.parse(atob(tokenParts[1]));
  //       console.log("Role", decodedToken.role);
        
  //       if(decodedToken.role !== "ROLE_ADMIN") {
  //         redirect("/not-found");
  //       }

  //       setCertified(true);
  //       const params = new URLSearchParams(document.location.search).get("content");
  //       if(params!== null){
  //         const jsonObject = JSON.parse(params);
  //         console.log(jsonObject)
  //         setContent(jsonObject);
  //       }
  // }, [userToken]);

  useEffect(() => {
    const userInfoString = sessionStorage.getItem('userInfo');
    
    if(userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        const tokenParts = userInfo.state.userToken.split(".");
        console.log(tokenParts[1]);
        const decodedToken = JSON.parse(atob(tokenParts[1]));
        console.log("Role", decodedToken.role);
        
        if(decodedToken.role !== "ROLE_ADMIN") {
          redirect("/not-found");
        }

        setCertified(true);
    } else {
      redirect("/not-found");
    }
  }, []);

  useEffect(() => {
    if(certified){
      const params = new URLSearchParams(document.location.search).get("content");
      if(params!== null){
        const jsonObject = JSON.parse(params);
        console.log(jsonObject)
        setContent(jsonObject);
      }
    }
  }, [certified]);

  return (
    certified &&
    <div className="h-screen flex flex-col justify-center items-center">
      <div>
        <div className="font-nexonGothic_Bold text-lg">상세 내용</div>
        <pre className="font-nexonGothic mt-5">{JSON.stringify(content, null, 2)}</pre>
        {content && content.imageUrl && (
          <img className="mt-5" src={content.imageUrl} alt="이미지" />
        )}
      </div>
    </div>
  );
};

export default ReportDetailPage;