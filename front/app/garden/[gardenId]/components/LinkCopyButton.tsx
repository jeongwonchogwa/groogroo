"use client";
import { usePathname } from "next/navigation";
import IconButton from "@/app/components/IconButton";

const LinkCopyButton = () => {
  const url = usePathname();
  // 추후 배포된 url로 변경해야겠죠
  const urlHref = "http://localhost:3000" + url;

  const doCopy = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          alert("클립보드에 복사되었습니다.");
        })
        .catch(() => {
          alert("복사를 다시 시도해주세요.");
        });
    } else {
      alert("복사하기가 지원되지 않는 브라우저입니다.");
    }
  };

  return (
    <div className="w-full h-full">
      <div className="h-5 w-5">
        <IconButton iconSrc="link" onClick={() => doCopy(urlHref)} />
      </div>
    </div>
  );
};

export default LinkCopyButton;
