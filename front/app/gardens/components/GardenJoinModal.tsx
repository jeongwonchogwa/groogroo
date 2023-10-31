import Button from "@/app/components/Button";
import PixelCard from "@/app/components/PixelCard";

interface GardenJoinModalProps {
  isJoinModalOpen: boolean;
  handleModal: () => void;
  selectedGardenId: number;
}

const GardenJoinModal = ({ isJoinModalOpen, handleModal, selectedGardenId }: GardenJoinModalProps) => {
  if (!isJoinModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute w-full h-full bg-gray-900 opacity-50" onClick={handleModal}></div>
      <PixelCard
        isModal={true}
        content={
          <div className="p-4 flex flex-col w-full rounded z-50 bg-white">
            <div className="flex flex-col p-1 h-full">
              <div className="mx-7">
                <div className=" text-center w-full">
                  <span className="font-bitBit text-3xl text-primary">시크릿 가든</span>
                  <span className="font-neoDunggeunmo_Pro text-xl">을</span>
                </div>
                <p className="font-neoDunggeunmo_Pro text-xl">함께 가꾸시겠습니까?</p>
              </div>
              <div className="mt-3 w-full">
                <div className="grid grid-flow-col gap-2">
                  <Button color="default" label="아니요" onClick={handleModal} />
                  <Button
                    color="secondary"
                    label="네"
                    onClick={() => {
                      console.log("네 클릭");
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default GardenJoinModal;
