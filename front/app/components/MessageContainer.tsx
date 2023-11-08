"use client";

// 너무 거지 같이 만들었어요 미안해요 쓰는 사람 저에게 알려주세요....
import IconButton from "./IconButton";
import CardModal from "./CardModal";
import ButtonModal from "./ButtonModal";
import Button from "./Button";
import { Fruit } from "../types";
import TextModal from "./TextModal";

interface MessageContainerProps {
  openDelete: boolean;
  handleDeleteModal: () => void;
  handleDelete: (id: number) => void;
  currentIndex: number;
  data: Fruit[];
  handleTextArea: (e: any) => void;
  openReport: boolean;
  handleReportModal: (fruitId: number) => void;
  handleReport: (fruitId: number) => void;
  clickReport: boolean;
}

const MessageContainer = ({
  openDelete,
  handleDeleteModal,
  handleDelete,
  currentIndex,
  data,
  handleTextArea,
  openReport,
  handleReportModal,
  handleReport,
  clickReport,
}: MessageContainerProps) => {
  console.log("MessageContainerProps - ", data);
  return (
    <>
      {data.length > 0 ? (
        <div className="nes-container is-rounded bg-white w-full h-full flex flex-col !p-4">
          <div className="w-full flex justify-between">
            <p className="font-nexonGothic text-lg text-text-sub">{data[currentIndex].createTime}</p>
            <div className="flex flex-row">
              <div className="w-9 h-9 mr-2">
                <IconButton iconSrc="trash" onClick={handleDeleteModal} />
              </div>
              <div className=" w-9 h-9">
                <IconButton iconSrc="siren" onClick={() => handleReportModal(data[currentIndex].id)} />
              </div>
            </div>
          </div>
          <div className="w-full mt-2">
            <span className="font-bitBit text-2xl">From. </span>
            <span className="font-bitBit text-2xl">{data[currentIndex].writerNickname}</span>
          </div>
          <div className="w-full mt-5 overflow-auto">
            <span className="font-nexonGothic text-xl">{data[currentIndex].content}</span>
          </div>
        </div>
      ) : (
        <div>데이터가 없어요</div>
      )}
      {/* 삭제하기 눌렀을때 나오는 모달 */}
      {openDelete && (
        <ButtonModal
          isOpenModal={openDelete}
          handleModal={handleDeleteModal}
          state="error"
          title="열매 삭제"
          content={
            <div>
              열매를 삭제하시겠습니까? <br /> 삭제된 열매는 복구할 수 없습니다.
            </div>
          }
          button={
            <div className="grid grid-flow-col gap-2">
              <Button
                color="default"
                label="취소"
                onClick={() => {
                  handleDeleteModal();
                }}
              />
              <Button
                color="error"
                label="삭제"
                onClick={() => {
                  console.log("삭제 클릭");
                  handleDelete(data[currentIndex].id);
                  handleDeleteModal();
                }}
              />
            </div>
          }
        />
      )}
      {/* 신고하기 눌렀을때 폼 */}
      {openReport && (
        <CardModal
          isOpen={openReport}
          handleToggle={() => handleReportModal(data[currentIndex].id)}
          label={"신고하기"}
          previousText="채팅 메시지를 신고하거나"
          followingText="정원에서 사용자를 차단할 수 있습니다."
          selectedId={data[currentIndex].id}
          handleClick={handleReport}
        >
          <div className="flex flex-col p-5">
            <div className="flex flex-col font-nexonGothic">
              <div className="grid grid-cols-4 mt-1">
                <div className="text-gray-500">작성자</div>
                <div className="col-span-3 trancate">{data[currentIndex].writerNickname}</div>
              </div>
              <div className="grid grid-cols-4">
                <div className="text-gray-500">내용</div>
                <div className="col-span-3 truncate">{data[currentIndex].content}</div>
              </div>
            </div>
            <hr className="mt-2" />
            <div className="flex flex-col">
              <div className="mt-2 font-nexonGothic text-gray-500">신고 사유</div>
              <div className="h-[160px] w-full">
                <textarea
                  onChange={handleTextArea}
                  placeholder="신고 사유를 작성해주세요"
                  id="report"
                  className="p-2 mt-1 w-full h-full resize-none font-nexonGothic_Medium overflow-auto border-outline border-2 rounded-lg"
                ></textarea>
              </div>
            </div>
          </div>
        </CardModal>
      )}
      {/* 신고하기에서 신고버튼 클릭 시 나오는 모달 */}
      {clickReport && (
        <TextModal
          state="success"
          content={<div>신고가 접수 되었습니다.</div>}
          title="신고 접수"
          handleModalWithParam={handleReport}
          isOpenModal={clickReport}
        />
      )}
    </>
  );
};

export default MessageContainer;
