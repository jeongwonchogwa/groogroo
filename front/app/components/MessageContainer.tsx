"use client";

// 너무 거지 같이 만들었어요 미안해요 쓰는 사람 저에게 알려주세요....
import IconButton from "./IconButton";
import CardModal from "./CardModal";
import ButtonModal from "./ButtonModal";
import Button from "./Button";
import { Fruit } from "../types";
import TextModal from "./TextModal";
import ReportModal from "./ReportModal";
import DeleteModal from "./DeleteModal";
import { useEffect, useState } from "react";
import { userTreeStore } from "@/stores/userTreeStore";
import { userInfoStore } from "@/stores/userInfoStore";

interface MessageContainerProps {
  dataType: "TREE" | "GARDEN" | "FRUIT" | "FLOWER" | "TREEGARDEN";
  currentIndex?: number;
  data: Fruit;
  availableDelete?: boolean;
  isSearch?: boolean;
}

const MessageContainer = ({
  data,
  dataType,
  availableDelete = true,
  isSearch,
}: MessageContainerProps) => {
  const [openDelete, setOpenDelete] = useState(false);
  const handleDeleteModal = () => {
    setOpenDelete((prev: any) => !prev);
  };

  // 신고하기 모달 띄우기
  // 근데 신고하기 든 삭제든 아 변수를 나누지 않으면 두개가 한번에 실행되겠구나...
  const [openReport, setOpenReport] = useState<boolean>(false);

  // 신고하기 모달 오픈
  const handleReportModal = () => {
    setOpenReport((prev) => !prev);
  };

  return (
    <>
      <div className="nes-container is-rounded bg-white w-full h-full flex flex-col !p-4">
        <div className="w-full flex justify-between">
          <p className="font-nexonGothic text-lg text-text-sub">
            {data.createTime}
          </p>
          <div className="flex flex-row">
            <div className="w-9 h-9 mr-2">
              {availableDelete && (
                <IconButton iconSrc="trash" onClick={handleDeleteModal} />
              )}
            </div>
            <div className=" w-9 h-9">
              {!isSearch && (
                <IconButton iconSrc="siren" onClick={handleReportModal} />
              )}
            </div>
          </div>
        </div>
        <div className="w-full mt-2">
          <span className="font-bitBit text-2xl">From. </span>
          <span className="font-bitBit text-2xl">{data.writerNickname}</span>
        </div>
        <div className="w-full mt-5 overflow-auto">
          <span className="font-nexonGothic text-xl">{data.content}</span>
        </div>
      </div>
      {/* 삭제하기 눌렀을때 나오는 모달 */}
      {openDelete && (
        <DeleteModal id={data.id} handleDeleteModal={handleDeleteModal} />
      )}
      {openReport && dataType === "FRUIT" ? (
        <ReportModal
          fruitData={data}
          dataType={dataType}
          handleReportModal={handleReportModal}
        />
      ) : null}
    </>
  );
};

export default MessageContainer;
