"use client";

import IconButton from "@/app/components/IconButton";
import MessageContainer from "@/app/components/MessageContainer";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

//  더미를 여따가 잠시 넣을게요
const Alldata = [
  {
    httpStatus: "success",
    message: "나무 검색 성공",
    trees: [
      {
        id: 1,
        imageUrl: "주소!!",
        name: "쿠마수정나무",
        fruits: [
          {
            id: 1,
            writerId: 1,
            writerNickname: "내",
            content:
              "잘지내내내내내내내내내내내내내내내내내내내내내내내내내내내ㅐㅐㅐㅐㅐㅐㅐㅐㅐㅐㅐㅐㅐㅐㅐㅐㅐㅐㅐㅐㅐㅐㅐㅐㅐㅐ~",
            createTime: "14:10",
          },
          {
            id: 2,
            writerId: 1,
            writerNickname: "가",
            content: "잘지내~",
            createTime: "14:10",
          },
          {
            id: 3,
            writerId: 1,
            writerNickname: "누",
            content: "잘지내~",
            createTime: "14:10",
          },
          {
            id: 4,
            writerId: 1,
            writerNickname: "구",
            content: "잘지내~",
            createTime: "14:10",
          },
          {
            id: 5,
            writerId: 1,
            writerNickname: "게",
            content: "잘지내~",
            createTime: "14:10",
          },
          {
            id: 6,
            writerId: 1,
            writerNickname: "아",
            content: "잘지내~",
            imageUrl: "http://이미지주소",
            createTime: "14:10",
          },
          {
            id: 7,
            writerId: 1,
            writerNickname: "잉",
            content: "잘지내~",
            imageUrl: "http://이미지주소",
            createTime: "14:10",
          },
        ],
        fruitsCount: 7,
      },
    ],
  },
];

// interface FruitMessageConiainerProp {
//   isOpen: boolean;
//   handleModal: () => void;
//   data: Fruit[];
//   prevFruits: () => void;
//   currentIndex: number;
//   nextFruits: () => void;
//   handleTextArea: (e: any) => void;
// }

const FruitMessageContainer = () => {
  const router = useRouter();

  // 나무데이터 전역적으로 가지고 있어야해

  // fruits 배열 추출
  const data = Alldata[0].trees.map((tree) => tree.fruits).flat();

  // 현재 열매 데이터가 Fruits의 어느 위치에 있니?
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextFruits = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
  };

  const prevFruits = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
  };

  console.log("currentIndex 현재", currentIndex);

  // 삭제하기 눌렀을때 나오는 모달
  const [openDelete, setOpenDelete] = useState(false);
  const handleDeleteModal = () => {
    setOpenDelete((prev: any) => !prev);
  };

  // 삭제 버튼 누르고 나면 실행할 함수
  const handleDelete = (id: number) => {
    // 여기서 fetch 함수를 불러서 사용한다..?
    console.log("이거는 handleDelete", id);
  };

  // 신고하기 내용 handling
  const [reportInput, setReportInput] = useState<string>("");

  const handleTextArea = (e: any) => {
    setReportInput(e.target.value);
  };

  // 신고하기 모달 띄우기
  // 근데 신고하기 든 삭제든 아 변수를 나누지 않으면 두개가 한번에 실행되겠구나...
  const [openReport, setOpenReport] = useState<boolean>(false);

  // 선택된 fruitId 이건 어따 쓰는거야?
  const [selectedFruitId, setSelectedFruitId] = useState<number>(0);

  // 신고하기 모달 오픈
  const handleReportModal = (fruitId: number) => {
    setOpenReport((prev) => !prev);
    // fetch로 현재 선택된 데이터 넘기기 위한 것
    setSelectedFruitId(fruitId);
  };

  // 신고하기 버튼 눌렀는지 확인
  const [clickReport, setClickReport] = useState<boolean>(false);

  // 신고 버튼 클릭시 수행할 함수
  const handleReport = (fruitId: number) => {
    setClickReport((prev) => !prev);
    console.log("이거는 모달 클릭 시 나오는 행동", fruitId);
    if (openReport) {
      setOpenReport(false);
    }
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

  console.log("여기는 FruitMessageContainer - repostInput", reportInput);
  // 데이터를 여기서 불러오는게 맞는거지?
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-row">
        <div className="w-7 my-auto">
          <IconButton iconSrc="arrow" onClick={prevFruits} />
        </div>
        <div className="w-full h-[350px] mr-3 ml-1">
          <MessageContainer
            handleTextArea={handleTextArea} // 신고하기 내용 입력 받고 확인하는 곳
            currentIndex={currentIndex} // 현재 열매가 Fruits 배열에서 어디 인덱스에 위치했는지 확인
            data={data} // 전체 열매 데이터
            openDelete={openDelete} // 삭제 버튼 눌렀니?
            handleDeleteModal={handleDeleteModal} // 삭제 버튼 눌렀을때 handling 하는 함수
            handleDelete={handleDelete}
            openReport={openReport} // 신고 버튼 눌렀니?
            handleReportModal={handleReportModal} // 신고 버튼 눌렀을 때 handling 하는 함수 <- 이때 신고 진짜 할거니 모달 띄우기
            clickReport={clickReport} // 신고 진짜 할거니 버튼 눌렀니?
            handleReport={handleReport} // 신고 진짜 할거니 버튼 눌렀을 떄 handling 하는 함수 <- 이때 열매 아이디 가져와야해
          />
        </div>
        <div className="w-7 my-auto">
          <IconButton iconSrc="arrow" rotate={true} onClick={nextFruits} />
        </div>
      </div>
    </div>
  );
};

export default FruitMessageContainer;
