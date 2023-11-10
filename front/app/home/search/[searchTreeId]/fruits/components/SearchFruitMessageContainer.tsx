"use client";

import IconButton from "@/app/components/IconButton";
import MessageContainer from "@/app/components/MessageContainer";
import { searchTreeStore } from "@/stores/searchTreeInfo";
import Image from "next/image";
import { useEffect, useState } from "react";

const SearchFruitMessageContainer = () => {
  const { searchTreeInfoData, setSearchTreeInfo } = searchTreeStore();
  console.log(searchTreeInfoData);

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

  // 삭제하기 눌렀을때 나오는 모달
  const [openDelete, setOpenDelete] = useState(false);
  const handleDeleteModal = () => {
    setOpenDelete((prev: any) => !prev);
  };

  // 삭제 버튼 누르고 나면 실행할 함수
  const handleDelete = (id: number) => {
    fetchDelete(id);
  };

  let today = new Date();
  let hours = today.getHours();
  let minutes = today.getMinutes();

  const [availableDelete, setAvailableDelete] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      const [createTimeHours, createTimeMinutes] = data[currentIndex].createTime.split(":");
      const timeDifference = hours * 60 + minutes - Number(createTimeHours) * 60 + Number(createTimeMinutes);

      if (timeDifference < 6) {
        setAvailableDelete(!availableDelete);
      }
    }
  }, [data, currentIndex, hours, minutes, availableDelete]);

  // 삭제하기 api 연결
  const fetchDelete = (id: number) => {
    fetch(`${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/fruit/${id}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.status === 200) {
        if (searchTreeInfoData && searchTreeInfoData.fruits) {
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
      {data && data?.length > 0 ? (
        <div className="w-full flex flex-col">
          <div className="w-full flex flex-row">
            <div className="w-7 my-auto">{data.length > 0 && <IconButton iconSrc="arrow" onClick={prevFruits} />}</div>
            {/* h를 박아 넣는게 맞나...? */}
            <div className="w-full h-[350px] mr-3 ml-1">
              <MessageContainer
                availableDelete={availableDelete}
                isSearch={true}
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
      ) : (
        <div className="w-full h-full flex justify-center">
          <div className="nes-container is-rounded w-full bg-white flex flex-col">
            <div className="w-full flex justify-center mt-3">
              <Image alt="no_data" src="/assets/images/no_data.svg" width={150} height={350} />
            </div>
            <p className="w-full flex justify-center mt-3 font-neoDunggeunmo_Pro text-lg ">새로운 열매를 달아주세요!</p>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchFruitMessageContainer;
