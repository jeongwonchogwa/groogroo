"use client";

import IconButton from "@/app/components/IconButton";
import { Garden } from "@/app/types";

interface Props {
  garden : Garden;
}

// description에 정원 이름이 정해진 경우 그 함께 .. 정원을 가꾸어 보아요!로 변경해야함
const KakaoButton = (props : Props) => {
  const onClick = () => {
    const { Kakao, location } = window;
    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "정원에 초대되셨습니다!🌳",
        description: `함께 ${props.garden.name}을(를) 가꾸어 보아요!🌼🌷`,
        // 추후 s3에 올라올 logo 사진으로 변경해야함
        imageUrl: "https://mud-kage.kakao.com/dn/NTmhS/btqfEUdFAUf/FjKzkZsnoeE4o19klTOVI1/openlink_640x640s.jpg",
        link: {
          // [내 애플리케이션] > [플랫폼] 에서 등록한 사이트 도메인과 일치해야 함
          webUrl: "groogroo.site",
          mobileWebUrl: "groogroo.site",
        },
      },

      buttons: [
        {
          title: "정원 꾸미러 바로가기",
          link: {
            webUrl: location.href,
            mobileWebUrl: location.href,
          },
        },
      ],
    });
  };

  return (
    <div className="w-full h-full">
        <IconButton iconSrc="kakao" onClick={onClick} />
    </div>
  );
};
export default KakaoButton;
