"use client";

import { useState, useEffect } from 'react';
import { Content } from  "@/app/types";

const ReportDetailPage = () => {
  const [content, setContent] = useState<Content>();

  useEffect(() => {
    const params = new URLSearchParams(document.location.search).get("content");
    if(params!== null){
      const jsonObject = JSON.parse(params);
      console.log(jsonObject)
      setContent(jsonObject);
    }
  }, []);

  return (
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