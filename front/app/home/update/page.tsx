"use client";

import Button from "@/app/components/Button";
import UpdateContainer from "./components/updateContainer";
import UpdateTreeSection from "./components/updateTreeSection";
import { useEffect, useState } from "react";
import { userInfoStore } from "@/stores/userInfoStore";
import { Preset } from "@/app/types";
import TextModal from "@/app/components/TextModal";
import { redirect, useRouter, useSearchParams } from "next/navigation";
const UpdatePage = () => {
  // 토큰 이렇게 가져오면 안됨, 세션에 저장된 토큰 가져와야 함

  const { userToken } = userInfoStore();

  useEffect(() => {
    // 경로 수정 필요
    if (userToken === "") redirect("/enter");
  }, [userToken]);

  const router = useRouter();
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    } else {
      setWidth(window.innerWidth);
    }
  }, []);

  const [newName, setNewName] = useState<string>("");

  // 0 => 나무 input 클릭 | 1 => 유효성 실패 | 2 => 유효성 성공 중복확인 실패 | 3 => 유효성 성공 중복확인 성공
  const [checkTree, setCheckTree] = useState<number>(0);

  // 나무 인풋 클릭 여부 확인
  const handleInput = (e: any) => {
    const value = e.target.value;
    setNewName(value);
    setCheckTree(0);
  };

  // 나무 이름 중복확인
  const fetchTreeCheck = () => {
    const isValid = /^[가-힣A-Za-z0-9\s]+$/.test(newName);
    if (!isValid) {
      setCheckTree(1);
    } else {
      fetchTreeNameCheck(newName);
    }
  };

  const fetchTreeNameCheck = async (name: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/tree/check/${name}`,
        {
          method: "GET",
        }
      );
      if (response.status === 200) {
        const responseData = await response.json();
        if (responseData.result) {
          setCheckTree(2);
        } else {
          setCheckTree(3);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 프리셋 가져오기 -> updatePreset에서 처리
  const [treePreset, setTreePreset] = useState<Preset[]>([]);
  const fetchPreset = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/tree/preset`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (response.status === 200) {
        const responseData = await response.json();
        setTreePreset(responseData.presets);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPreset();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % treePreset.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + treePreset.length) % treePreset.length
    );
  };

  // --- 여기까지 preset에서 처리해야함
  const [checkIsValid, setCheckIsValid] = useState<boolean>(false);

  const handleCheckIsValidModal = () => {
    setCheckIsValid((prev) => !prev);
  };

  // timeout 이벤트 걸어줌
  useEffect(() => {
    if (checkIsValid) {
      const timeoutId = setTimeout(() => {
        setCheckIsValid(false);
      }, 2000);

      // 컴포넌트가 언마운트되면 타이머를 정리, 뭐든 왜 정리를 해줘야 하니..
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [checkIsValid]);
  const newData: {
    imageUrl: string;
    name: string;
  } = {
    imageUrl: treePreset[currentIndex] && treePreset[currentIndex].imageUrl,
    name: newName,
  };

  const params = useSearchParams();
  const type = params.get("type");

  const clickChange = async () => {
    if (type === "name" && checkTree < 3) {
      handleCheckIsValidModal();
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/tree`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(newData),
        }
      );
      if (response.status === 200) {
        // 사실 모달을 띄워야 할 것 같긴한데..ㅎ
        const responseData = await response.json();
        router.push("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* 높이는 계속 박아넣고 있어요 -> calc로 변경 */}
      <div className="w-full h-[calc(100%-60px)]">
        <div className="flex flex-col">
          <div className="mt-12 mb-7 mx-9">
            <Button color="white" label="나무 바꾸기" active={false} />
          </div>
          <div className="mt-3 h-[400px]">
            <UpdateTreeSection
              currentIndex={currentIndex}
              nextSlide={nextSlide}
              prevSlide={prevSlide}
              data={treePreset}
            />
          </div>
          <div className="w-full h-[60px]">
            <UpdateContainer
              data={treePreset[currentIndex]}
              width={width}
              value={newName}
              onChange={handleInput}
              checkTree={checkTree}
              fetchTreeCheck={fetchTreeCheck}
              clickChange={clickChange}
            />
          </div>
        </div>
      </div>
      {checkIsValid && (
        <TextModal
          title="유효성 확인 실패"
          content="나무 이름 유효성을 확인해주세요"
          isOpenModal={checkIsValid}
          state="error"
          handleModal={handleCheckIsValidModal}
        />
      )}
    </>
  );
};

export default UpdatePage;
