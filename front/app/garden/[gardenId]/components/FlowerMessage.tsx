import Button from "@/app/components/Button";
import { fetchWithTokenCheck } from "@/app/components/FetchWithTokenCheck";
import IconButton from "@/app/components/IconButton";
import MessageContainer from "@/app/components/MessageContainer";
import ReportModal from "@/app/components/ReportModal";
import { Flower } from "@/app/types";
import { userInfoStore } from "@/stores/userInfoStore";
import { useRouter } from "next/navigation";
import Router from "next/router";
import React, { useEffect, useState } from "react";

interface Props {
  game: Phaser.Game;
  gardenId: number;
  flowerPos: Flower[];
  onFlowerClick: (flower: Flower) => void;
  currentFlower: Flower;
  onFormCloseButtonClick: () => void;
}
const FlowerMessage = (props: Props) => {
  // const AccessToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
  const router = useRouter();
  const { userToken } = userInfoStore();
  const [openReport, setOpenReport] = useState<boolean>(false);
  const [clickReport, setClickReport] = useState<boolean>(false);
  const [isDeleteable, setIsDeleteable] = useState<boolean>(true);
  const [content, setContent] = useState<string>("");
  useEffect(() => {
    const createTime = props.currentFlower.createTime;
    if (createTime?.includes(":")) {
      const currentTime = new Date();

      const createTimeArr = createTime.split(":");
      const givenTime = new Date();
      givenTime.setHours(parseInt(createTimeArr[0], 10));
      givenTime.setMinutes(parseInt(createTimeArr[1], 10));

      // 현재 시간과 주어진 시간의 차이 계산
      const timeDifference = currentTime.getTime() - givenTime.getTime();

      // 차이를 분 단위로 계산
      const minuteDifference = timeDifference / (1000 * 60);
      if (minuteDifference > 5) {
        setIsDeleteable(false);
      }
    } else {
      setIsDeleteable(false);
    }
  }, []);

  // 신고하기 모달 오픈
  const handleReportModal = () => {
    setOpenReport((prev) => !prev);
    // fetch로 현재 선택된 데이터 넘기기 위한 것
  };
  const onModifyButtonClick = async () => {
    props.onFormCloseButtonClick();
    props.game.scene.stop("gardenScene");
    props.game.scene.start("flowerEditScene", {
      modifyFlower: props.currentFlower,
    });
  };

  const onNextFlowerButtonClick = () => {
    for (let i = 0; i < props.flowerPos.length; i++) {
      if (props.flowerPos[i].id === props.currentFlower.id) {
        if (i < props.flowerPos.length - 1) {
          props.onFlowerClick(props.flowerPos[i + 1]);
        } else {
          props.onFlowerClick(props.flowerPos[0]);
        }
      }
    }
  };

  const onPrevFlowerButtonClick = () => {
    for (let i = 0; i < props.flowerPos.length; i++) {
      if (props.flowerPos[i].id === props.currentFlower.id) {
        if (i > 0) {
          props.onFlowerClick(props.flowerPos[i - 1]);
        } else {
          props.onFlowerClick(props.flowerPos[props.flowerPos.length - 1]);
        }
      }
    }
  };

  const onTrashButtonClick = async () => {
    try {
      const res = await fetchWithTokenCheck(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/flower/${props.currentFlower.id}`,

        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
        router
      );
      const data = await res.json();

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/garden/${props.gardenId}`,

          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        const gardenData = await res.json();
        //@ts-ignore
        props.game!.scene.getScene("preloader").garden = gardenData.gardenInfo;

        props.game?.scene.stop("gardenScene");
        props.game?.scene.start("preloader");
      } catch (err) {
        console.log(err);
      }
      props.onFormCloseButtonClick();
    } catch (err) {
      console.log(err);
    }
  };

  const formattedContent = props.currentFlower.content
    ?.split("\n")
    .map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < props.currentFlower.content!.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="p-5 flex flex-col gap-5 w-full"
    >
      {openReport ? (
        <ReportModal
          dataType="FLOWER"
          handleReportModal={() => {
            handleReportModal();
          }}
          flowerData={props.currentFlower}
        />
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-2">
            <div className="w-fit h-fit">
              <IconButton iconSrc="arrow" onClick={onPrevFlowerButtonClick} />
            </div>
            <div className="pl-1 pr-3 w-full">
              <div className="nes-container is-rounded bg-white w-full h-full flex flex-col !p-4">
                <div className="w-full flex justify-between">
                  <p className="font-nexonGothic text-lg text-text-sub">
                    {props.currentFlower.createTime}
                  </p>
                  <div className="flex flex-row">
                    <div className="w-9 h-9 mr-2">
                      <IconButton
                        iconSrc="move"
                        onClick={onModifyButtonClick}
                      />
                    </div>
                    {isDeleteable ? (
                      <div className="w-9 h-9 mr-2">
                        <IconButton
                          iconSrc="trash"
                          onClick={onTrashButtonClick}
                        />
                      </div>
                    ) : null}
                    <div className=" w-9 h-9">
                      <IconButton
                        iconSrc="siren"
                        onClick={() => {
                          handleReportModal();
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
                    {formattedContent}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-fit">
              <IconButton
                iconSrc="arrow"
                rotate
                onClick={onNextFlowerButtonClick}
              />
            </div>
          </div>
          <div className="pl-5 absolute bottom-10 w-[calc(100%-60px)] max-w-[540px]">
            <Button
              color="default"
              label="닫기"
              onClick={props.onFormCloseButtonClick}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowerMessage;
