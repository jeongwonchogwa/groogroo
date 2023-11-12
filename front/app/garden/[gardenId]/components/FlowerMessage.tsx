import Button from "@/app/components/Button";
import IconButton from "@/app/components/IconButton";
import MessageContainer from "@/app/components/MessageContainer";
import { Flower } from "@/app/types";
import { useState } from "react";

interface Props {
  game: Phaser.Game;
  gardenId: number;
  currentFlower: Flower;
  onFormCloseButtonClick: () => void;
}
const FlowerMessage = (props: Props) => {
  const AccessToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
  const [openReport, setOpenReport] = useState<boolean>(false);
  const [clickReport, setClickReport] = useState<boolean>(false);

  const [reportInput, setReportInput] = useState<string>("");

  // 신고하기 모달 오픈
  const handleReportModal = () => {
    setOpenReport((prev) => !prev);
    // fetch로 현재 선택된 데이터 넘기기 위한 것
  };

  const handleReport = () => {
    setClickReport((prev) => !prev);
    fetchReport({
      content: reportInput,
      contentType: "FLOWER",
      targetId: props.currentFlower.id!,
    });
    if (openReport) {
      setOpenReport(false);
    }
  };

  const fetchReport = async (reportData: object) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/user/report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AccessToken}`,
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

  const onTrashButtonClick = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/flower/${props.currentFlower.id}`,

        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${AccessToken}`,
          },
        }
      );
      const data = await res.json();

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/garden/${props.gardenId}`,

          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${AccessToken}`,
            },
          }
        );
        const gardenData = await res.json();
        console.log(gardenData);
        //@ts-ignore
        props.game!.scene.getScene("preloader").garden = gardenData.gardenInfo;

        console.log();
        props.game?.scene.stop("gardenScene");
        props.game?.scene.start("preloader");
      } catch (error) {
        console.log(error);
      }
      props.onFormCloseButtonClick();
    } catch (error) {
      console.log(error);
    }
  };

  const handleTextArea = (e: any) => {
    setReportInput(e.target.value);
  };

  console.log("꽃 메세지입니다.");
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="p-5 flex flex-col gap-5 w-full"
    >
      <div className="flex flex-col gap-5">
        <div className="pl-1 pr-3">
          <div className="nes-container is-rounded bg-white w-full h-full flex flex-col !p-4">
            <div className="w-full flex justify-between">
              <p className="font-nexonGothic text-lg text-text-sub">
                {props.currentFlower.createTime}
              </p>
              <div className="flex flex-row">
                <div className="w-9 h-9 mr-2">
                  <IconButton iconSrc="trash" onClick={onTrashButtonClick} />
                </div>
                <div className=" w-9 h-9">
                  <IconButton
                    iconSrc="siren"
                    onClick={() => {
                      handleReportModal;
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="w-full mt-2">
              <span className="font-bitBit text-2xl">From. </span>
              <span className="font-bitBit text-2xl">
                {props.currentFlower.writerNickName}
              </span>
            </div>
            <div className="w-full mt-5 overflow-auto">
              <span className="font-nexonGothic text-xl">
                {props.currentFlower.content}
              </span>
            </div>
          </div>
        </div>
        <div className="px-2">
        <Button
          color="default"
          label="닫기"
          onClick={props.onFormCloseButtonClick}
        />
        </div>
      </div>
    </div>
  );
};

export default FlowerMessage;
