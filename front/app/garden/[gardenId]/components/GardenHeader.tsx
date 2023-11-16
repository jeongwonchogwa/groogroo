"use client";
import IconButton from "@/app/components/IconButton";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Menu from "./MenuTextBox";
import { Garden, MenuButton } from "@/app/types";
import Alarm from "@/app/components/Alarm";
import JoinModal from "./JoinModal";
import { useQueryClient } from "@tanstack/react-query";
import ManagerModal from "./ManagerModal";

interface Props {
  garden: Garden;
  game?: Phaser.Game;
  state: string;
}

const GardenHeader = (props: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [openAlarm, setOpenAlarm] = useState<boolean>(false);
  const [openJoinModal, setOpenJoinModal] = useState<boolean>(false);
  const [openManagerModal, setOpenManagermodal] = useState<boolean>(false);
  const [menuList, setMenuList] = useState<MenuButton[]>([]);

  const onMenuButtonClick = () => {
    setOpenMenu(!openMenu);
    setOpenAlarm(false);
  };

  const onAlarmButtonClick = () => {
    setOpenAlarm(!openAlarm);
    setOpenMenu(false);
  };

  const onJoinButtonClick = () => {
    console.log("참여 모달 오픈");
    if (props.game) {
      //@ts-ignore
      props.game.scene.getScene("gardenScene").modalChec = true;
    }
    setOpenJoinModal((prev) => !prev);
  };

  const onManagerButtonClick = () => {
    setOpenMenu(false);
    console.log(props.game);
    if (props.game) {
      //@ts-ignore
      props.game.scene.getScene("gardenScene").modalCheck = true;
    }
    setOpenManagermodal((prev) => !prev);
  };

  const onFormCloseButtonClick = () => {
    if (props.game) {
      //@ts-ignore
      props.game.scene.getScene("gardenScene").modalCheck = false;
    }
    setOpenJoinModal(false);
    setOpenManagermodal(false);
  };

  const [uiWidth, setUiWidth] = useState<String>("");

  const url = usePathname();
  // 추후 배포된 url로 변경해야겠죠
  const urlHref = "groogroo.site" + url;

  const doCopy = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          alert("클립보드에 복사되었습니다.");
        })
        .catch(() => {
          alert("복사를 다시 시도해주세요.");
        });
    } else {
      alert("복사하기가 지원되지 않는 브라우저입니다.");
    }
  };

  const kakaoInvite = () => {
    const { Kakao, location } = window;
    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "정원에 초대되셨습니다!🌳",
        description: `함께 ${props.garden.name}을(를) 가꾸어 보아요!🌼🌷`,
        // 추후 s3에 올라올 logo 사진으로 변경해야함
        imageUrl:
          "https://mud-kage.kakao.com/dn/NTmhS/btqfEUdFAUf/FjKzkZsnoeE4o19klTOVI1/openlink_640x640s.jpg",
        link: {
          // [내 애플리케이션] > [플랫폼] 에서 등록한 사이트 도메인과 일치해야 함
          webUrl: "groogroo.site",
          mobileWebUrl: "groogroo.site",
        },
      },

      buttons: [
        {
          title: "정원 꾸미러 바로가기",
          link: {
            webUrl: location.href,
            mobileWebUrl: location.href,
          },
        },
      ],
    });
  };

  useEffect(() => {
    setUiWidth(window.innerWidth + "px");
    if (props.garden.state === "ACCEPT") {
      if (props.garden.gardenRole === "MEMBER") {
        setMenuList([
          {
            name: "초대 전송",
            clickEvent: () => {
              kakaoInvite();
            },
          },
          {
            name: "링크 복사",
            clickEvent: () => {
              doCopy(urlHref);
            },
          },
        ]);
      } else {
        console.log(props.garden.gardenRole)
        setMenuList([
          {
            name: "초대 전송",
            clickEvent: () => {
              kakaoInvite();
            },
          },
          {
            name: "링크 복사",
            clickEvent: () => {
              doCopy(urlHref);
            },
          },
          {
            name: "회원 관리",
            clickEvent: () => {
              onManagerButtonClick();
            },
          },
        ]);
        
      }
    } else if (props.garden.state === "WAIT") {
      console.log("요청 진행중");
      setMenuList([
        { name: "회원가입 신청을 확인중입니다.", clickEvent: () => {} },
      ]);
    } else if (props.state === "KICK") {
      console.log("추방");
      setMenuList([{ name: "추방당하셨습니다.", clickEvent: () => {} }]);
    } else if(props.garden.capacity > props.garden.memberCnt!){
      setMenuList([
        {
          name: "참여신청",
          clickEvent: () => {
            onJoinButtonClick();
          },
        },
      ]);
    } else if(props.garden.capacity <= props.garden.memberCnt!){
      setMenuList([
        {
          name: "정원이 모두 차 가입할 수 없습니다.",
          clickEvent: () => {
          },
        },
      ]);
    }
  }, []);

  return (
    <div
      className="absolute top-5 px-5 flex gap-5 font-bitBit justify-between"
      style={{ width: `${uiWidth}` }}
    >
      <div className="h-10 w-10 z-20">
        <IconButton
          iconSrc="close"
          onClick={() => {
            props.game?.destroy(true,false)
            queryClient.removeQueries({ queryKey: ["getGardenInfo"] });
            
            router.push("../gardens");
            console.log("홈");
          }}
        />
      </div>

      <div className="flex gap-5">
        <div className="flex flex-col gap-2 h-10 w-10">
          <IconButton iconSrc="bell" onClick={onAlarmButtonClick} />
          {openAlarm && props.game ? <Alarm game={props.game}/> : null}
        </div>
        {openAlarm ? null : (
          <div className="flex flex-col gap-2 h-10 w-10 items-end z-40">
            <div className="flex flex-col gap-2 h-10 w-10 items-end z-40">
              <IconButton iconSrc="menu" onClick={onMenuButtonClick} />
              {openMenu ? <Menu menuList={menuList}></Menu> : null}
            </div>
          </div>
        )}
      </div>
      {openJoinModal ? (
        <div className="absolute">
          <JoinModal
            onJoinButtonClick={onJoinButtonClick}
            onFormCloseButtonClick={onFormCloseButtonClick}
            gardenId={props.garden.gardenId}
          />
        </div>
      ) : null}

      {openManagerModal ? (
        <div className="absolute top-[-20px] left-0">
          <ManagerModal
            garden={props.garden}
            onFormCloseButtonClick={onFormCloseButtonClick}
          />
        </div>
      ) : null}
    </div>
  );
};

export default GardenHeader;
