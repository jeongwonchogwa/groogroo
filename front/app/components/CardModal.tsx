import Button from "./Button";

interface CardModalProps {
  label: "추방하기" | "신고하기" | "수락하기";
  previousText: string;
  followingText: string;
  isOpen: boolean;
  handleToggle: () => void;
  children: React.ReactNode;
}

const CardModal = ({ label, previousText, followingText, isOpen, handleToggle, children }: CardModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute w-full h-full bg-gray-900 opacity-50" onClick={handleToggle}></div>
      <div className="bg-modal-img h-[598px] w-[350px] mx-auto rounded z-50 overflow-y-auto">
        <div className="p-4 w-full h-full">
          <div className="flex flex-col w-full">
            <div className="flex flex-col w-full mt-8">
              <div className="font-bitBit text-3xl text-center">{label}</div>
              <div className=" font-nexonGothic_Light text-sm text-center mt-3">
                {previousText}
                <br />
                {followingText}
              </div>
            </div>
            <div className=" w-full mt-5">
              <div className="mx-2">
                <div className="flex flex-row">
                  <div className="mx-auto my-auto">
                    <div className="w-[5px] h-[300px] bg-black" />
                  </div>
                  <div className="w-full flex flex-col">
                    <div className="w-full h-[5px] bg-black"></div>
                    <div className="w-full h-[300px]">
                      {/* 여기는 children으로 받는게 맞을 듯 */}
                      {children}
                    </div>
                    <div className="w-full h-[5px] bg-black"></div>
                  </div>
                  <div className="my-auto">
                    <div className="w-[5px] h-[300px] bg-black" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 mx-2">
              <div className="grid grid-flow-col gap-2">
                <Button onClick={handleToggle} color="default" label="취소" />
                {/* 수락, 신고, 추방 */}
                {label === "수락하기" ? (
                  <Button color="primary" label="수락하기" />
                ) : label === "신고하기" ? (
                  <Button color="error" label="신고" />
                ) : (
                  <Button color="error" label="추방" />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="modal-close absolute top-0 right-0 cursor-pointer p-4" onClick={handleToggle}></div>
      </div>
    </div>
  );
};

export default CardModal;
