import Button from "@/app/components/Button";
import PixelCard from "@/app/components/PixelCard";
import { Garden, User } from "@/app/types";
import { userInfoStore } from "@/stores/userInfoStore";
import Image from "next/image";
import { useEffect, useState } from "react";
import YesNoModal from "./YesNoModal";
import { title } from "process";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchWithTokenCheck } from "@/app/components/FetchWithTokenCheck";

interface Props {
  onFormCloseButtonClick: () => void;
  garden: Garden;
}

const ManagerModal = (props: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
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

  const onAdminButtonClick = (id: number, name: string) => {
    setYesNoModalContent({
      noFunction: () => {
        setOpenYesNoModal(false);
      },
      yesFunction: () => {
        fetchAdmin(id);
        setOpenYesNoModal(false);
      },
      question: `${name}님을 관리자로 지정하시겠습니까?`,
      title: "관리자 임명",
      yesMessage: "확인",
    });
    setOpenYesNoModal(true);
  };

  const onMemberButtonClick = (id: number, name: string) => {
    setYesNoModalContent({
      noFunction: () => {
        setOpenYesNoModal(false);
      },
      yesFunction: () => {
        fetchMember(id);
        setOpenYesNoModal(false);
      },
      question: `${name}님을 일반멤버로 지정하시겠습니까?`,
      title: "관리자 해제",
      yesMessage: "확인",
    });
    setOpenYesNoModal(true);
  };

  const fetchMemberList = async () => {
    try {
      const res = await fetchWithTokenCheck(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/garden/member/${props.garden.gardenId}`,

        {
          method: "GET",
        },
        router
      );
      const data = await res.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAdmin = async (userId: number) => {
    try {
      const res = await fetchWithTokenCheck(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/garden/master`,

        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            targetId: userId,
            gardenId: props.garden.gardenId,
            role: "ADMIN",
          }),
        },
        router
      );
      const data = await res.json();
      if (data.httpStatus === "success") {
        queryClient.invalidateQueries({ queryKey: ["getMemberListInfo"] });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMember = async (userId: number) => {
    try {
      const res = await fetchWithTokenCheck(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/garden/master`,

        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            targetId: userId,
            gardenId: props.garden.gardenId,
            role: "MEMBER",
          }),
        },
        router
      );
      const data = await res.json();
      if (data.httpStatus === "success") {
        queryClient.invalidateQueries({ queryKey: ["getMemberListInfo"] });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchStateChange = async (userId: number, state: string) => {
    try {
      const res = await fetchWithTokenCheck(
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
        },
        router
      );
      const data = await res.json();
      if (data.httpStatus === "success") {
        queryClient.invalidateQueries({ queryKey: ["getMemberListInfo"] });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const { data: memberData, isLoading } = useQuery({
    queryKey: ["getMemberListInfo"],
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
                            {user.treeName}
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
                      <div key={member.userId} className="w-[320px] py-3">
                        <div className="flex justify-between text-2xl gap-10 font-nexonGothic_Medium px-2">
                          <div className="flex gap-2">
                            {member.gardenRole === "MASTER" ? (
                              <div className="flex items-center text-primary text-sm font-bitBit">
                                M
                              </div>
                            ) : null}
                            {member.gardenRole === "ADMIN" ? (
                              <div className="flex items-center text-error text-sm font-bitBit">
                                A
                              </div>
                            ) : null}
                            {member.treeName}
                          </div>
                          {member.gardenRole === "ADMIN" &&
                          props.garden.gardenRole === "MASTER" ? (
                            <div className="flex gap-5">
                              <Image
                                src="/assets/images/down.svg"
                                alt="강등"
                                width={25}
                                height={25}
                                onClick={() =>
                                  onMemberButtonClick(
                                    member.userId,
                                    member.treeName
                                  )
                                }
                              />
                              <Image
                                src="/assets/images/kick.svg"
                                alt="추방"
                                width={25}
                                height={25}
                                onClick={() =>
                                  onStateChangeButtonClick(
                                    member.userId,
                                    member.treeName,
                                    "KICK"
                                  )
                                }
                              />
                            </div>
                          ) : null}
                          {member.gardenRole === "MEMBER" ? (
                            <div className="flex gap-5">
                              <Image
                                src="/assets/images/up.svg"
                                alt="승급"
                                width={25}
                                height={25}
                                onClick={() =>
                                  onAdminButtonClick(
                                    member.userId,
                                    member.treeName
                                  )
                                }
                              />
                              <Image
                                src="/assets/images/kick.svg"
                                alt="추방"
                                width={25}
                                height={25}
                                onClick={() =>
                                  onStateChangeButtonClick(
                                    member.userId,
                                    member.treeName,
                                    "KICK"
                                  )
                                }
                              />
                            </div>
                          ) : null}
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
