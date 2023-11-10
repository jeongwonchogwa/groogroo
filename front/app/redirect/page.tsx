"use client"

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const RedirectPage = () => {
  const router = useRouter();
  const search = useSearchParams();

  useEffect(() => {
    // 페이지가 로드될 때 URL에서 accessToken을 추출
    const accesstoken = search?.get("accesstoken")
    if (accesstoken) {
      const accessToken = accesstoken as string;
      // accessToken을 저장하거나 다른 작업을 수행
      console.log('Received access token:', accessToken);
      // 여기다가 추가 코드 작성해서
      // 토큰을 저장해주세요.
      router.push('/enter/terms')
    }
  }, []);

  return <div>Redirecting...</div>;
};

export default RedirectPage;