import PixelCard from "@/app/components/PixelCard";

// 이거 필요없어
interface GardenJoinProcessModalProps {
  isJoinProcessModalOpen: boolean;
  handleSignUp: () => void;
  state?: boolean;
}

// Todo.
// 테스트 중이어서 state를 true로 설정
// 실제로는 state가 false면 처리 실패로 떠야해
// 모달 너비 이대로 괜찮은가..!
const GardenJoinProcessModal = ({
  isJoinProcessModalOpen,
  handleSignUp,
  state = true,
}: GardenJoinProcessModalProps) => {
  if (!isJoinProcessModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute w-full h-full bg-gray-900 opacity-50" onClick={handleSignUp}></div>
      <PixelCard
        isModal={true}
        content={
          <div className="p-4 flex flex-col w-full rounded z-50 bg-white">
            <div className="flex flex-col p-1 h-full">
              <div className="mx-7 h-full">
                <div className=" text-center w-full">
                  <span className="font-bitBit text-3xl text-primary">시크릿 가든</span>
                  <span className="font-neoDunggeunmo_Pro text-xl">가입</span>
                </div>
                <p className="font-neoDunggeunmo_Pro text-xl my-auto">
                  {state ? "요청이 전송되었습니다." : "요청에 실패했습니다"}
                </p>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default GardenJoinProcessModal;
