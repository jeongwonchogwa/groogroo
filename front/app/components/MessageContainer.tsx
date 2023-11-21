"use client";

import IconButton from "./IconButton";
import { Fruit } from "../types";
import ReportModal from "./ReportModal";
import DeleteModal from "./DeleteModal";
import { useEffect, useState } from "react";

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
            {!isSearch && (
              <div className=" w-9 h-9">
                <IconButton iconSrc="siren" onClick={handleReportModal} />
              </div>
            )}
          </div>
        </div>
        <div className="w-full mt-2 flex flex-row">
          <p className="font-bitBit text-2xl w-[80px]">From. </p>
          <p className="font-bitBit text-xl ml-2 flex mt-[3px]">
            {data.writerNickname}
          </p>
        </div>
        <div className="w-full mt-3 overflow-auto">
          <span
            className="font-nexonGothic text-xl"
            style={{ whiteSpace: "pre-line" }}
          >
            {data.content}
          </span>
        </div>
      </div>
      {openDelete && (
        <DeleteModal
          id={data.id}
          handleDeleteModal={handleDeleteModal}
          isSearch={isSearch}
        />
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
