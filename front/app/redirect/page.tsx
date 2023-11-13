"use client"

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { userInfoStore } from '../../stores/userInfoStore';
import { useEventSourceStore  } from '../../stores/eventSourceStore';


const RedirectPage = () => {
  const router = useRouter();
  const search = useSearchParams();

  useEffect(() => {
    
    const accessToken = search?.get("accesstoken")
    if (accessToken) {

      // accessToken을 userInfoStore에 저장
      userInfoStore.getState().setMember(accessToken);

      // accessToken을 저장하거나 다른 작업을 수행
      console.log('Received access token:', accessToken);

      const tokenParts = accessToken.split(".");
      if (tokenParts.length === 3) {
        const decodedToken = JSON.parse(atob(tokenParts[1]));
        console.log(tokenParts[1]);
        console.log(decodedToken)
        const userId = decodedToken.id; 
        const treeId = decodedToken.treeId; 

        // 여기서 userId와 treeId를 사용할 수 있음
        console.log('id:', userId);
        console.log('treeId:', treeId);

        // EventSource 생성
        const sse = new EventSource(`${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/notification/subscribe/${userId}`);
        useEventSourceStore.getState().setEventSource(sse);
        const destination = treeId === undefined ? '/enter/terms' : '/home';
        router.push(destination);
        console.log(sse);
      } else {
        console.error('Invalid access token format');
      }
    }
  }, []);

  return <div>Redirecting...</div>;
};

export default RedirectPage;