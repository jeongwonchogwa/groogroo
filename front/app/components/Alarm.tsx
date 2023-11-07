"use client";

import { useEffect, useState } from "react";
import Button from "./Button";
import PixelCard from "./PixelCard";

const alarmData = [
  {
    type: "fruit",
    writerNickname: "문요환",
    content:
      "오늘은 마라샹궈 먹는날 츄릅 오늘은 마라샹궈 먹는날 츄릅오늘은 마라샹궈 먹는날 츄릅오늘은 마라샹궈 먹는날 츄릅오늘은 마라샹궈 먹는날 츄릅",
    createTime: "11월 1일",
  },
  {
    type: "fruit",
    writerNickname: "김지원",
    content: "슬릭백 춤 개고수. 공중부양 허경영인줄",
    createTime: "11월 1일",
  },
  {
    type: "flower",
    gardenInfo: { gardenId: 1, name: "쉿 몽환의 숲" },
    writerNickname: "",
    content: "김한나 힘 너무 쎄요. 무서워요.",
    createTime: "11월 1일",
  },
  {
    type: "fruit",
    writerNickname: "차차아버님",
    content: "자기소개서 언제쓰지 ㅎ",
    createTime: "11월 2일",
  },
  {
    type: "garden",
    writerNickname: "김지원",
    gardenInfo: { gardenId: 1, name: "쉿 몽환의 숲" },
  },
];

const AlarmList = () => {
  // window null 방지를 위해 useEffect 처리
  const [wWidth, setWwidth] = useState(window.innerWidth);
  useEffect(() => {
    if (!window) {
      return;
    }
    setWwidth(window.innerWidth);
  }, []);

  return (
    <div className="bg-white" style={{ width: wWidth - 30 }}>
      <div className="align py-2 px-5 text-[24px] font-bitBit">알람</div>
      <div>
        {alarmData.map((alarm, index) => {
          return (
            <div key={index}>
              {alarm.type === "fruit" ? (
                <div className="flex flex-col w-full p-3 gap-2">
                  <div className="flex w-full justify-between items-baseline ">
                    <div className="font-nexonGothic_Bold text-base">
                      내 나무에 열매가 달렸습니다.
                    </div>
                    <div className="font-nexonGothic_Light text-sm">
                      {alarm.createTime}
                    </div>
                  </div>
                  <div className="font-nexonGothic_Light text-base overflow-hidden whitespace-nowrap text-ellipsis">
                    {alarm.content}
                  </div>
                </div>
              ) : alarm.type === "flower" ? (
                <div className="flex flex-col w-full p-3 gap-2">
                  <div className="flex w-full justify-between items-baseline">
                    <div className="font-nexonGothic_Bold text-base">
                      {alarm.gardenInfo?.name} 에 꽃이 심어졌습니다.
                    </div>
                    <div className="font-nexonGothic_Light text-sm">
                      {alarm.createTime}
                    </div>
                  </div>
                  <div className="font-nexonGothic_Light text-base">
                    {alarm.content}
                  </div>
                </div>
              ) : alarm.type === "garden" ? (
                <div className="flex w-full justify-between items-center">
                  <div className="w-[180px] font-nexonGothic_Bold h-fit">
                    {alarm.writerNickname} 님이 {alarm.gardenInfo?.name}에
                    참여를 요청하셨습니다.
                  </div>
                  <div className="flex gap-5">
                    <Button color="secondary" label="수락"></Button>
                    <Button color="default" label="거절" />
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Alarm = () => {
  return (
    <div className="absolute -top-5 left-0 z-0">
      <PixelCard content={AlarmList()}></PixelCard>
    </div>
  );
};

export default Alarm;
