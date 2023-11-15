"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import Button from "./Button";
import PixelCard from "./PixelCard";
import { userInfoStore } from '../../stores/userInfoStore';

interface AlarmInfo {
  id: number;
}

const AlarmList = () => {
  const router = useRouter();

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
        const sortedAlarmData = data.gardenInfo.sort((a: AlarmInfo, b: AlarmInfo) => b.id - a.id);
        console.log(data.gardenInfo)
        setAlarmData(sortedAlarmData);
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
    <div className="bg-background overflow-y-auto max-h-[300px]" style={{ width: wWidth - 30 }}>
      <div className="align py-2 px-5 text-[24px] font-bitBit">알람</div>
      <div>
        {alarmData.map((alarm, index) => {
          const createDate = new Date(alarm.createTime);
          const formattedDate = `${createDate.getMonth() + 1}월${createDate.getDate()}일`;

          const treeClick = async () => {
            try {
              await fetch(`${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/notification/read/${alarm.id}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${AccessToken}`,
                },
              });
              router.push(`/home/${alarm.contentId}`);
            } catch (error) {
              console.error('Error while updating notification:', error);
            }
          };
          
          const gardenClick = async () => {
            try {
              await fetch(`${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/notification/read/${alarm.id}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${AccessToken}`,
                },
              });
              router.push(`/garden/${alarm.contentId}`);
            } catch (error) {
              console.error('Error while updating notification:', error);
            }
          };

          const responseClick = async () => {
            try {
              await fetch(`${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/notification/read/${alarm.id}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${AccessToken}`,
                },
              });
            } catch (error) {
              console.error('Error while updating notification:', error);
            }
          };

          return (
            <div key={index}>
              {alarm.type === "FRUIT" ? (
                <div className={`flex flex-col w-full p-3 gap-2 ${!alarm.read ? 'bg-background-container' : ''}`} onClick={treeClick}>
                  <div className="flex w-full justify-between items-baseline ">
                    <div className="font-nexonGothic_Bold text-base">
                      {alarm.name}에 열매가 달렸습니다.
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
                <div className={`flex flex-col w-full p-3 gap-2 ${!alarm.read ? 'bg-background-container' : ''}`} onClick={gardenClick}>
                  <div className="flex w-full justify-between items-baseline">
                    <div className="font-nexonGothic_Bold text-base">
                      {alarm.name}에 꽃이 심어졌습니다.
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
                <div className={`flex flex-col w-full p-3 gap-2 ${!alarm.read ? 'bg-background-container' : ''}`} onClick={gardenClick}>
                  <div className="flex w-full justify-between items-baseline">
                    <div className="font-nexonGothic_Bold text-base">
                      {alarm.name}정원에 가입신청이 있습니다.
                    </div>
                    <div className="font-nexonGothic_Light text-sm">
                      {formattedDate}
                    </div>
                  </div>
                  <div className="font-nexonGothic_Light text-base">
                    {alarm.content}
                  </div>
                </div>  
              ) : alarm.type === "GARDEN_RESPONSE" ? (
                <div className={`flex flex-col w-full p-3 gap-2 ${!alarm.read ? 'bg-background-container' : ''}`} onClick={responseClick}>
                  <div className="flex w-full justify-between items-baseline">
                    <div className="font-nexonGothic_Bold text-base">
                      {alarm.name}정원 가입요청 결과입니다.
                    </div>
                    <div className="font-nexonGothic_Light text-sm">
                      {formattedDate}
                    </div>
                  </div>
                  <div className="font-nexonGothic_Light text-base">
                    {alarm.content}
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
