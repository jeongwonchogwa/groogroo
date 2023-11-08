interface AdminDeleteModalProps {
  contentType: string;
  targetId: number;
  onCancel: () => void;
  onConfirm: () => void;
}

const AdminDeleteModal = ({ contentType, targetId, onConfirm, onCancel }: AdminDeleteModalProps) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center  bg-black bg-opacity-50">
      <div className="bg-white p-4 w-1/3 rounded-lg shadow-lg">
        <div className="mt-8 font-nexonGothic">
          <p className="flex justify-center">{targetId}번 {contentType} (을)를 삭제하시겠습니까?</p>
        </div>
        
        <div className="grid grid-flow-col gap-2 font-nexonGothic_Bold text-lg">
          <button
            className="flex items-center justify-center text-white bg-primary rounded-lg py-2 my-1 text-base"
            onClick={onConfirm}
          >
            확인
          </button>
          <button
            className="flex items-center justify-center text-white bg-error rounded-lg py-2 my-1 text-base"
            onClick={onCancel}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDeleteModal;