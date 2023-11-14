import { NextRouter } from "next/router";
import { userInfoStore } from "@/stores/userInfoStore";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface FetchOptions extends RequestInit {
}

async function refreshToken(accessToken: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/user/refresh`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    console.log('재발급 요청 보냈음')
    if (!res.ok) {
        throw new Error(`토큰 재발급 실패: ${res.status}`);
    }

    const data = await res.json();
    return data.accessToken;
}

export async function fetchWithTokenCheck(url: string, options: FetchOptions = {}, router: AppRouterInstance) {

    const userInfoString = sessionStorage.getItem('userInfo');

    if (!userInfoString) {
        router.push('/enter');
        throw new Error('사용자 정보가 없습니다.');
      }
    
    const userInfo = JSON.parse(userInfoString);
    const accessToken = userInfo?.state?.userToken;


    let flag = false;
    // 토큰 만료 확인
    try {
        const base64Url = accessToken.split('.')[1]; // JWT의 payload 부분 추출
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        const exp = payload.exp;
        const now = Date.now() / 1000; // 현재 시간을 초 단위로 변환
    
        flag = now > exp;
    } catch (error) {
        console.error("토큰 검사 중 오류 발생:", error);
        flag = true; // 오류가 발생하면 만료된 것으로 처리
    }
  
    let token = '';
    // 토큰이 만료된 경우 갱신
    if (flag) {
        
        const updatedToken = await refreshToken(accessToken);
        userInfo.state.userToken = updatedToken;
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        token = updatedToken;
    }else {
        token = accessToken;
    }

    // 토큰을 헤더에 추가
    const fetchOptions: FetchOptions = {
        ...options,
        headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`
        }
    };
  
    const response = await fetch(url, fetchOptions);

    return response;
  }