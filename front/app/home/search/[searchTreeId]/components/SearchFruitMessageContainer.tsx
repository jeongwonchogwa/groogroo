"use client";

import IconButton from "@/app/components/IconButton";
import MessageContainer from "@/app/components/MessageContainer";
import { searchTreeStore } from "@/stores/searchTreeInfo";
import { useState } from "react";
import Image from "next/image";

const SearchFruitMessageContainer = () => {
  const { searchTreeInfoData, setSearchTreeInfo } = searchTreeStore();

  // 나무 id를 pathname에서 가져와서 현재 내 나무의 id와 같은지 비교
  // 같으면? 현재 유저의 열매 내용 보여주고 // 다르면? 신고 버튼 없애고, 삭제 버튼은 작성 5분 이내만 보여주고, Header에서는 수정하기 없어야 하고, 열매 만들기 버튼 만들어야해

  const data = searchTreeInfoData?.fruits;

  // 현재 열매 데이터가 `Fruits의 어느 위치에 있니?
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextFruits = () => {
    if (data) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    }
  };

  const prevFruits = () => {
    if (data) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
    }
  };

  console.log("currentIndex 현재", currentIndex);

  // 삭제하기 눌렀을때 나오는 모달
  const [openDelete, setOpenDelete] = useState(false);
  const handleDeleteModal = () => {
    setOpenDelete((prev: any) => !prev);
  };

  // 삭제 버튼 누르고 나면 실행할 함수
  const handleDelete = (id: number) => {
    fetchDelete(id);
  };

  // 삭제하기 api 연결
  const fetchDelete = (id: number) => {
    fetch(`${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/fruit/${id}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.status === 200) {
        if (searchTreeInfoData) {
          const updatedUserTree = { ...searchTreeInfoData };
          updatedUserTree.fruits = searchTreeInfoData?.fruits.filter((fruit) => fruit.id !== id);
          setSearchTreeInfo(updatedUserTree);
        }
      } else {
        console.log("삭제 실패");
      }
    });
  };

  // 선택된 fruitId 이건 어따 쓰는거야?
  const [selectedFruitId, setSelectedFruitId] = useState<number>(0);

  return (
    <>
      {data && (
        <div className="w-full flex flex-col">
          <div className="w-full flex flex-row">
            <div className="w-7 my-auto">{data.length > 0 && <IconButton iconSrc="arrow" onClick={prevFruits} />}</div>
            <div className="w-full h-[350px] mr-3 ml-1">
              <MessageContainer
                isSearch={true}
                isValidDelete={false}
                currentIndex={currentIndex} // 현재 열매가 Fruits 배열에서 어디 인덱스에 위치했는지 확인
                data={data} // 전체 열매 데이터
                openDelete={openDelete} // 삭제 버튼 눌렀니?
                handleDeleteModal={handleDeleteModal} // 삭제 버튼 눌렀을때 handling 하는 함수
                handleDelete={handleDelete}
              />
            </div>
            <div className="w-7 my-auto">
              {data.length > 0 && <IconButton iconSrc="arrow" rotate={true} onClick={nextFruits} />}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchFruitMessageContainer;
