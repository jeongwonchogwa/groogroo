"use client";

import PixelCard from "@/app/components/PixelCard";
import Button from "./Button";
import { useRouter } from "next/navigation";

interface ButtonModalProps {
  isOpenModal: boolean;
  handleModal: () => void;
  state?: boolean;
  button?: boolean;
}

// Todo. 이거 공통으로 사용하기에 이상해 잘 변경해야해
const ButtonModal = ({ isOpenModal, handleModal, state = true, button }: ButtonModalProps) => {
  const router = useRouter();

  if (!isOpenModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute w-full h-full bg-gray-900 opacity-50" onClick={handleModal}></div>
      <PixelCard
        isModal={true}
        content={
          <div className="p-4 flex flex-col w-full rounded z-50 bg-white">
            <div className="flex flex-col p-1 h-full">
              <div className="h-full">
                <div className="mx-5 text-center ">
                  <p className="font-bitBit text-3xl text-primary">나무 수정하기</p>
                  {/* <span className="font-neoDunggeunmo_Pro text-xl">가입</span> */}
                </div>
                {/* <p className="font-neoDunggeunmo_Pro text-xl my-auto">
                  {state ? "요청이 전송되었습니다." : "요청에 실패했습니다"}
                </p> */}
                {button && (
                  <div className="mt-7">
                    <div className="grid grid-flow-col gap-2">
                      <Button
                        color="default"
                        label="NEW"
                        onClick={() => {
                          router.push("/enter/check");
                          handleModal();
                        }}
                      />
                      <Button
                        color="primary"
                        label="PRESET"
                        onClick={() => {
                          router.push("/home/update");
                          handleModal();
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default ButtonModal;
