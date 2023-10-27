import React from "react"

// Props로 받아올 변수들
interface modalProps {
    purpose: "yesno" | "copy" | "kick" | "accept" | "report";
    name?: string;
    isOpen: boolean;
    onClose: () => void;
}

const Modal: React.FC<modalProps> = ({ purpose, name, isOpen, onClose }) => {
    const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
          onClose(); // 모달 배경을 클릭하면 모달을 닫음
        }
    };
    if (!isOpen) {
        return null; // 모달이 닫혀 있을 때는 아무것도 렌더링하지 않음
    }

    const modalConfig: { [key in modalProps['purpose']]: string } = {
        yesno:
        "modal w-[390px] h-[190px] bg-white flex items-center justify-center",  
        copy: 
        "modal w-[390px] h-[190px] bg-white flex items-center justify-center",  
        kick: 
        "modal w-[350px] h-[550px] bg-white flex items-center justify-center", 
        accept: 
        "modal w-[350px] h-[550px] bg-white flex items-center justify-center", 
        report: 
        "modal w-[350px] h-[550px] bg-white flex items-center justify-center", 
    };
    

    return (
        <div className="modal" onClick={handleBackgroundClick}>
            {purpose === 'yesno' || purpose === 'copy' ? (
                <div className="w-[390px] flex flex-row">
                <div className="my-auto">
                    <div className="w-[5px] h-[190px] bg-black" />
                </div>
                <div className="w-[390px] flex flex-col">
                    <div className="w-[390px] h-[5px] bg-black"></div>
                    <div className="w-[390px]">
                        <div className={modalConfig[purpose]}>
                            <div className="modal-content flex flex-col justify-center items-center">
                                {/* 모달 내용 */}
                                <div className="flex justify-center items-center h-[40px]">
                                    <p className="font-bitBit text-primary text-[28px]">{name}</p>
                                    <p className="ml-2 font-neoDuggeunmo_Pro font-bold text-[20px]">
                                        {purpose === 'copy' ? "의" : "을"}
                                    </p>
                                </div>
                                <p className="font-neoDuggeunmo_Pro font-bold text-[20px]">
                                    {purpose === 'copy' ? "초대링크를 복사하시겠습니까?" : "함께 가꾸시겠습니까?"}
                                </p>

                                {/* 버튼 컴포 추가 & 모달 컨텐트 추가 필요 */}
        
                                {/* 닫기 버튼 */}
                                <button onClick={onClose}>Close</button>
                            </div>
                        </div>
                    </div>
                    <div className="w-[390px] h-[5px] bg-black"></div>
                </div>
                <div className="my-auto">
                    <div className="w-[5px] h-[190px] bg-black" />
                </div>
                </div>
            ) : (
                <div className="w-[350px] flex flex-row">
                <div className="my-auto">
                    <div className="w-[5px] h-[550px] bg-black" />
                </div>
                <div className="w-[350px] flex flex-col">
                    <div className="w-[350px] h-[5px] bg-black"></div>
                    <div className="w-[350px]">
                        <div className={modalConfig[purpose]}>
                            <div className="modal-content flex flex-col justify-center items-center">
                                {/* 모달 내용 */}
                                <div className="flex justify-center items-center h-[40px] mb-4">
                                    <p className="font-bitBit text-[32px]">
                                    {purpose === 'kick'? "추방하기" : 
                                    purpose === 'accept'? "수락하기" :
                                    "신고하기"
                                    }
                                    </p>
                                </div>
                                <p className="font-nexonGothic text-[20px] h-[20px]">
                                    {purpose === 'kick'? "사고뭉치 금쪽이들로부터" : 
                                    purpose === 'accept'? "수락하기 멘트" :
                                    "채팅메시지를 신고하거나"
                                    }
                                </p>
                                <p className="font-nexonGothic text-[20px] h-[20px]">
                                    {purpose === 'kick'? "정원을 지켜주세요." : 
                                    purpose === 'accept'? "수락하기 멘트 추천좀 제발." :
                                    "정원에서 사용자를 차단할 수 있습니다."
                                    }
                                </p>
        
                                {/* 닫기 버튼 */}
                                <button onClick={onClose}>Close</button>
                            </div>
                        </div>
                    </div>
                    <div className="w-[350px] h-[5px] bg-black"></div>
                </div>
                <div className="my-auto">
                    <div className="w-[5px] h-[550px] bg-black" />
                </div>
                </div>
            )}
        </div>
    );
};

export default Modal;





    