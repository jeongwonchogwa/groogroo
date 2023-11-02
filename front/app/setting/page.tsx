"use client";

//Todo. 뒤로가기 버튼 router.back()한번에 처리
import Link from "next/link";
import Button from "../components/Button";
import IconButton from "../components/IconButton";
import { useRouter } from "next/navigation";

const SettingPage = () => {
  const router = useRouter();
  return (
    <div className="w-screen h-screen bg-background-pixel bg-cover">
      <div className="flex w-full flex-col">
        <div className="mt-5 mx-7">
          <div className="flex flex-row">
            <div className="w-3 mr-2">
              <IconButton iconSrc="arrow" onClick={() => router.back()} />
            </div>
            {/* 이거를 이렇게 각각 router.back()을 하는건 굉장히 비효율적인것 같은데 */}
            <div className="my-auto font-neoDunggeunmo_Pro text-xl" onClick={() => router.back()}>
              뒤로가기
            </div>
          </div>
        </div>
        <div className=" mt-10 mx-16">
          <Button color="white" label="Setting" active={false} />
        </div>
        <div className="w-full h-full">
          <div className="mx-5 mt-7">
            <div className="nes-container is-rounded flex flex-col bg-white h-[450px]">
              <div className="lists">
                <ul className="nes-list is-circle font-neoDunggeunmo_Pro text-xl px-5">
                  <li
                    className="mb-2"
                    onClick={() => {
                      console.log("로그아웃 클릭");
                    }}
                  >
                    로그아웃
                  </li>
                  <li
                    onClick={() => {
                      console.log("문의하기 클릭");
                    }}
                  >
                    <Link href="http://pf.kakao.com/_xoIkxbG">문의하기</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <p
          className=" mt-10 text-center font-neoDunggeunmo_Pro text-lg text-white"
          onClick={() => {
            console.log("탈퇴하기 클릭");
          }}
        >
          탈퇴하기
        </p>
      </div>
    </div>
  );
};

export default SettingPage;
