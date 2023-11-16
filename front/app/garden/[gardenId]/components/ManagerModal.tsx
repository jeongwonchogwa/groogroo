import Button from "@/app/components/Button";
import PixelCard from "@/app/components/PixelCard";
import { Garden, User } from "@/app/types";
import { userInfoStore } from "@/stores/userInfoStore";
import Image from "next/image";
import { useEffect, useState } from "react";
import YesNoModal from "./YesNoModal";
import { title } from "process";
import { useQuery } from "@tanstack/react-query";

interface Props {
  onFormCloseButtonClick: () => void;
  garden: Garden;
}

const ManagerModal = (props: Props) => {
  const { userToken } = userInfoStore();
  const [openYesNoModal, setOpenYesNoModal] = useState<boolean>(false);
  const [yesNoModalContent, setYesNoModalContent] = useState<{
    noFunction: () => void;
    question: string;
    title: string;
    yesFunction: () => void;
    yesMessage: string;
  }>();

  const onStateChangeButtonClick = (
    id: number,
    name: string,
    state: string
  ) => {
    if (state === "KICK") {
      setYesNoModalContent({
        noFunction: () => {
          setOpenYesNoModal(false);
        },
        yesFunction: () => {
          fetchStateChange(id, state);
          setOpenYesNoModal(false);
        },
        question: `${name}님을 추방하시겠습니까?`,
        title: "추방하기",
        yesMessage: "확인",
      });
    } else if (state === "ACCEPT") {
      setYesNoModalContent({
        noFunction: () => {
          setOpenYesNoModal(false);
        },
        yesFunction: () => {
          fetchStateChange(id, state);
          setOpenYesNoModal(false);
        },
        question: `${name}님의 요청을 수락하시겠습니까?`,
        title: "가입 요청",
        yesMessage: "수락하기",
      });
    } else if (state === "REFUSE") {
      setYesNoModalContent({
        noFunction: () => {
          setOpenYesNoModal(false);
        },
        yesFunction: () => {
          fetchStateChange(id, state);
          setOpenYesNoModal(false);
        },
        question: `${name}님의 요청을 거절하시겠습니까?`,
        title: "가입 요청",
        yesMessage: "거절하기",
      });
    }

    setOpenYesNoModal(true);
  };

  const fetchMemberList = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/garden/member/${props.garden.gardenId}`,

        {
          method: "GET",
        }
      );
      const data = await res.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStateChange = async (userId: number, state: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/garden/process`,

        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            gardenId: props.garden.gardenId,
            joinState: state,
          }),
        }
      );
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const { data: memberData, isLoading } = useQuery({
    queryKey: ["getUserListInfo"],
    queryFn: fetchMemberList,
  });

  return (
    <div className="w-screen h-screen bg-black bg-opacity-50 z-50 flex flex-col justify-center items-center gap-5 px-5">
      <PixelCard
        content={
          <div className="flex flex-col bg-white w-full">
            <div className="font-bitbit text-3xl px-5 py-2">회원관리</div>
            <div className="bg-black w-full h-[2px] mb-2" />
            {isLoading ? null : (
              <div>
                {memberData.waitList?.map(
                  (user: {
                    userId: number;
                    treeName: string;
                    gardenRole: string;
                  }) => {
                    return (
                      <div
                        key={user.userId}
                        className="flex justify-between w-full px-2"
                      >
                        <div className="flex justify-between w-full items-center">
                          <div className="font-nexonGothic_Medium text-2xl">
                            {user.userId}
                          </div>
                          <div className="flex gap-5 h-fit">
                            <Button
                              color="secondary"
                              label="수락"
                              onClick={() =>
                                onStateChangeButtonClick(
                                  user.userId,
                                  user.treeName,
                                  "ACCEPT"
                                )
                              }
                            />
                            <Button
                              color="default"
                              label="거절"
                              onClick={() =>
                                onStateChangeButtonClick(
                                  user.userId,
                                  user.treeName,
                                  "REFUSE"
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}

                {memberData.memberList?.map(
                  (member: {
                    userId: number;
                    treeName: string;
                    gardenRole: string;
                  }) => {
                    return (
                      <div
                        key={member.userId}
                        className="w-[300px] min-h-[200px]"
                      >
                        <div className="flex justify-between text-2xl gap-10 font-nexonGothic_Medium px-2">
                          {member.treeName}
                          {member.gardenRole === "ADMIN" || "MASTER" ? null : (
                            <Image
                              src="/assets/images/kick.svg"
                              alt="추방"
                              width={20}
                              height={20}
                              onClick={() =>
                                onStateChangeButtonClick(
                                  member.userId,
                                  member.treeName,
                                  "KICK"
                                )
                              }
                            />
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
        }
      />
      <div className="w-[300px]">
        <Button
          color="default"
          label="닫기"
          onClick={props.onFormCloseButtonClick}
        />
      </div>
      {openYesNoModal ? (
        <YesNoModal
          noFunction={yesNoModalContent!.noFunction}
          question={yesNoModalContent!.question}
          title={yesNoModalContent!.title}
          yesFunction={yesNoModalContent!.yesFunction}
          yesMessage={yesNoModalContent!.yesMessage}
        />
      ) : null}
    </div>
  );
};

export default ManagerModal;