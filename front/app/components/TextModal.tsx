"use client";
import PixelCard from "./PixelCard";

interface TextModalProps {
  isOpenModal: boolean;
  handleModal?: () => void;
  handleModalWithParam?: (e: any) => void;
  state: "error" | "success";
  title: string;
  content: React.ReactNode;
}

const TextModal = ({
  isOpenModal,
  handleModal,
  handleModalWithParam,
  title,
  content,
  state = "success",
}: TextModalProps) => {
  const textColor = state === "error" ? "text-error" : "text-primary";

  if (!isOpenModal) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute w-full h-full bg-gray-900 opacity-50"
        onClick={handleModal ? handleModal : handleModalWithParam}
      ></div>
      <PixelCard
        isModal={true}
        content={
          <div className="p-2 flex flex-col w-full rounded z-50 bg-white">
            <div className="flex flex-col p-1 h-full">
              <div className="h-full">
                <div className="mx-5 text-center ">
                  <div className={`font-bitBit text-3xl ${textColor}`}>{title}</div>
                </div>
                <hr className="w-full" />
                <div className="mt-5 font-neoDunggeunmo_Pro text-xl text-center">{content}</div>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default TextModal;
