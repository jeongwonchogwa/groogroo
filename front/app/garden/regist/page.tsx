"use client";

import RegistDescriptionSection from "./components/RegistDescriptionSection";
import RegistTemplateSection from "./components/RegistTemplateSection";
import RegistNameSection from "./components/RegistNameSection";
import Button from "@/app/components/Button";
import { useRouter } from "next/navigation";

const RegistPage = () => {
  const router = useRouter();
  const clickCreate = () => {
    console.log("생성하기 버튼 클릭");
  };
  return (
    <div className="w-screen h-screen bg-background-pixel bg-blend-overlay bg-slate-200 bg-opacity-30 bg-cover">
      <div className="flex w-full h-full">
        <div className="w-full flex items-center mt-5 m-3">
          <div className="nes-container w-full bg-white mx-auto is-rounded !px-4">
            <p
              className="flex justify-center text-white font-bitBit text-3xl"
              style={{ textShadow: "-3px 0px black, 0px 3px  black, 3px 0px  black, 0px -3px black" }}
            >
              정원 만들기
            </p>
            <div className="flex flex-col">
              <RegistNameSection />
              <RegistDescriptionSection />
              <RegistTemplateSection />
            </div>
            <div className=" mt-8">
              <div className="grid grid-flow-col gap-2">
                <Button color="default" label="취소하기" onClick={() => router.back()} />
                <Button color="primary" label="생성하기" onClick={clickCreate} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistPage;
