import { useEffect, useState } from "react";
import CardModal from "./CardModal";
import TextModal from "./TextModal";
import { Flower, Fruit } from "../types";
import { userInfoStore } from "@/stores/userInfoStore";

interface Props {
  fruitData?: Fruit;
  flowerData?: Flower;
  handleReportModal: () => void;
  dataType: "TREE" | "GARDEN" | "FRUIT" | "FLOWER" | "TREEGARDEN";
}

const ReportModal = (props: Props) => {
  const { userToken } = userInfoStore();
  const [clickReport, setClickReport] = useState<boolean>(false);
  const [reportInput, setReportInput] = useState<string>("");

  const handleReport = () => {
    setClickReport((prev) => !prev);

    if (props.fruitData) {
      fetchReport({
        content: reportInput,
        contentType: props.dataType,
        targetId: props.fruitData.id,
      });
    } else if (props.flowerData) {
      fetchReport({
        content: reportInput,
        contentType: props.dataType,
        targetId: props.flowerData.id,
      });
    }

    props.handleReportModal();
  };

  const fetchReport = async (reportData: object) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/user/report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(reportData),
        }
      );

      if (response.status === 200) {
        const responseData = await response.json();
        console.log(responseData);
      } else {
        console.log("신고 실패");
      }
    } catch (error) {
      console.error("에러 발생: ", error);
    }
  };

  const handleTextArea = (e: any) => {
    setReportInput(e.target.value);
  };

  useEffect(() => {
    if (clickReport) {
      const timeoutId = setTimeout(() => {
        setClickReport(false);
      }, 2000);

      // 컴포넌트가 언마운트되면 타이머를 정리, 뭐든 왜 정리를 해줘야 하니..
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [clickReport]);

  return (
    <div>
      <CardModal
        isOpen={true}
        handleToggle={() => props.handleReportModal()}
        label={"신고하기"}
        previousText="채팅 메시지를 신고하거나"
        followingText="정원에서 사용자를 차단할 수 있습니다."
        selectedId={
          props.flowerData
            ? props.flowerData.id!
            : props.fruitData
            ? props.fruitData.id!
            : 0
        }
        handleClick={handleReport}
      >
        <div className="flex flex-col p-5">
          <div className="flex flex-col font-nexonGothic">
            <div className="grid grid-cols-4 mt-1">
              <div className="text-gray-500">작성자</div>
              <div className="col-span-3 trancate">
                {props.fruitData?.writerNickname}
              </div>
            </div>
            <div className="grid grid-cols-4">
              <div className="text-gray-500">내용</div>
              <div className="col-span-3 truncate">
                {props.fruitData?.content}
                {props.flowerData?.content}
              </div>
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
      {clickReport && (
        <TextModal
          state="success"
          content={<div>신고가 접수 되었습니다.</div>}
          title="신고 접수"
          handleModalWithParam={handleReport}
          isOpenModal={clickReport}
        />
      )}
    </div>
  );
};

export default ReportModal;
