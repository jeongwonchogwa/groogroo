"use client";

import PixelCard from "@/app/components/PixelCard";

interface ButtonModalProps {
  isOpenModal: boolean;
  handleModal: () => void;
  state?: "error" | "success";
  title: string;
  content?: React.ReactNode;
  button: React.ReactNode;
}

// Todo. 이거 공통으로 사용하기에 이상해 잘 변경해야해
const ButtonModal = ({ isOpenModal, handleModal, state = "success", title, content, button }: ButtonModalProps) => {
  const textColor = state === "error" ? "text-error" : "text-primary";

  if (!isOpenModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute w-full h-full bg-gray-900 opacity-50" onClick={handleModal}></div>
      <PixelCard
        isModal={true}
        content={
          <div className="p-1 flex flex-col w-full rounded z-50 bg-white">
            <div className="flex flex-col p-1 h-full">
              <div className="h-full">
                <div className="mx-5 text-center mt-3">
                  <p className={`font-bitBit text-3xl ${textColor}`}>{title}</p>
                </div>
                <hr className="w-full" />
                <div className="mt-3 font-neoDunggeunmo_Pro text-xl text-center">{content}</div>
                <div className="mt-7">
                  {button}
                  {/* button 이런 식으로 보내야함 */}
                  {/* <div className="grid grid-flow-col gap-2">
                    <Button
                      color="default"
                      label={label[0]}
                      onClick={() => {
                        router.push(url[0]);
                        handleModal();
                      }}
                    />
                    <Button
                      color="primary"
                      label={label[1]}
                      onClick={() => {
                        router.push(url[1]);
                        handleModal();
                      }}
                    />
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default ButtonModal;
