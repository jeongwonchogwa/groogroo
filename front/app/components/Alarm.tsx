"use client";

import { useEffect, useState } from "react";
import Button from "./Button";
import PixelCard from "./PixelCard";
import { userInfoStore } from '../../stores/userInfoStore';

const AlarmList = () => {
  // window null 방지를 위해 useEffect 처리
  const [alarmData, setAlarmData] = useState<any[]>([]);
  const [wWidth, setWwidth] = useState(window.innerWidth);

  const getUserToken = () => {
		const { userToken } = userInfoStore.getState();
		return userToken;
	}
	const AccessToken = getUserToken();
  // const AccessToken = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/notification/list`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AccessToken}`,
          },
        });
        const data = await res.json();
        console.log(data.gardenInfo)
        setAlarmData(data.gardenInfo);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();

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
          const createDate = new Date(alarm.createTime);
          const formattedDate = `${createDate.getMonth() + 1}월${createDate.getDate()}일`;
          return (
            <div key={index}>
              {alarm.type === "FRUIT" ? (
                <div className="flex flex-col w-full p-3 gap-2">
                  <div className="flex w-full justify-between items-baseline ">
                    <div className="font-nexonGothic_Bold text-base">
                      내 나무에 열매가 달렸습니다.
                    </div>
                    <div className="font-nexonGothic_Light text-sm">
                      {formattedDate}
                    </div>
                  </div>
                  <div className="font-nexonGothic_Light text-base overflow-hidden whitespace-nowrap text-ellipsis">
                    {alarm.content}
                  </div>
                </div>
              ) : alarm.type === "FLOWER" ? (
                <div className="flex flex-col w-full p-3 gap-2">
                  <div className="flex w-full justify-between items-baseline">
                    <div className="font-nexonGothic_Bold text-base">
                      {alarm.gardenInfo?.name} 에 꽃이 심어졌습니다.
                    </div>
                    <div className="font-nexonGothic_Light text-sm">
                      {formattedDate}
                    </div>
                  </div>
                  <div className="font-nexonGothic_Light text-base">
                    {alarm.content}
                  </div>
                </div>
              ) : alarm.type === "GARDEN_REQUEST" ? (
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
    <div className="absolute -top-5 left-0 z-30">
      <PixelCard content={AlarmList()}></PixelCard>
    </div>
  );
};

export default Alarm;
