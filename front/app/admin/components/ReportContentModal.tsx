interface ReportContentModalProps {
  content: string;
  onClose: () => void;
}

const ReportContentModal = ({ content, onClose }: ReportContentModalProps) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center  bg-black bg-opacity-50">
      <div className="bg-white p-4 w-1/3 rounded-lg shadow-lg">
        <div className=" font-nexonGothic_Bold text-lg">
          신고 내역
          <button className="float-right text-black" onClick={onClose}>
            X
          </button>
        </div>
        <div className="mt-8 font-nexonGothic">
          <p>{content}</p>
        </div>
        
      </div>
    </div>
  );
};

export default ReportContentModal;