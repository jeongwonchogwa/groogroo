"use client";

import RegistDescriptionSection from "./components/RegistDescriptionSection";
import RegistNameSection from "./components/RegistNameSection";
import RegistCapacitySection from "./components/RegistCapacitySection";
import RegistTemplateSection from "./components/RegistTemplateSection";
import Button from "@/app/components/Button";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { userInfoStore } from "@/stores/userInfoStore";
import TextModal from "@/app/components/TextModal";
import useUserToken from "@/app/hooks/useUserToken";
import useSearchTree from "@/app/hooks/useSearchTree";
import { fetchWithTokenCheck } from "@/app/components/FetchWithTokenCheck";

const RegistPage = () => {
  const userToken = useUserToken();
  const { treeId, loading, error } = useSearchTree(userToken);

  useEffect(() => {
    if (!loading && !error && treeId === null) {
      redirect("/enter/terms");
    }
  }, [loading, error, treeId]);

  const mapdata = ["/assets/maps/map[1].jpg", "/assets/maps/map[2].jpg"];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextMap = () => {
    if (mapdata) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % mapdata.length);
    }
  };

  const prevMap = () => {
    if (mapdata) {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + mapdata.length) % mapdata.length
      );
    }
  };

  const [gardenInput, setGardenInput] = useState({
    name: "",
    description: "",
    capacity: 0,
  });

  const { name, description, capacity } = gardenInput;

  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setGardenInput({ ...gardenInput, [name]: value });
  };

  const router = useRouter();

  const data: {
    name: string;
    description: string;
    capacity: number;
    mapType: number;
  } = {
    name: name,
    description: description,
    capacity: capacity,
    mapType: currentIndex + 1,
  };

  const fetchCreate = async (data: object) => {
    console.log("currentIndex가 뭐야?", currentIndex);
    try {
      const response = await fetchWithTokenCheck(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/garden`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(data),
        },
        router
      );

      if (response.status === 200) {
        const responseData = await response.json();
        const gardenUrl =
          responseData.gardenInfo.url + responseData.gardenInfo.gardenId;
        console.log(responseData);
        router.push(`/garden/${gardenUrl}`);
      }
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  const [capacityValidFail, setCapacityValidFail] = useState<boolean>(false);
  const handleModal = () => {
    setCapacityValidFail((prev) => !prev);
  };
  const clickCreate = () => {
    if (capacity === 0 || name === "") {
      setCapacityValidFail(true);
    } else {
      fetchCreate(data);
    }
  };

  return (
    <div className="w-screen h-screen bg-background-pixel bg-blend-overlay bg-slate-200 bg-opacity-30 bg-cover">
      <div className="flex w-full h-full">
        <div className="w-full flex items-center m-3">
          <div className="nes-container w-full bg-white mx-auto is-rounded !px-4">
            <p
              className="flex justify-center text-white font-bitBit text-3xl"
              style={{
                textShadow:
                  "-3px 0px black, 0px 3px  black, 3px 0px  black, 0px -3px black",
              }}
            >
              정원 만들기
            </p>
            <div className="flex flex-col">
              <RegistNameSection
                name="name"
                onChange={handleInput}
                value={name}
              />
              <RegistDescriptionSection
                name="description"
                onChange={handleInput}
                value={description}
              />
              <RegistCapacitySection
                name="capacity"
                onChange={handleInput}
                value={capacity}
              />
              <RegistTemplateSection
                currentIndex={currentIndex}
                mapdata={mapdata}
                nextMap={nextMap}
                prevMap={prevMap}
              />
            </div>
            <div className="mt-7">
              <div className="grid grid-flow-col gap-2">
                <Button
                  color="default"
                  label="취소하기"
                  onClick={() => router.back()}
                />
                <Button
                  color="primary"
                  label="생성하기"
                  onClick={clickCreate}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {capacityValidFail && (
        <TextModal
          isOpenModal={capacityValidFail}
          title="정원 생성 실패"
          state="error"
          content="정원 입력 폼을 확인해주세요"
          handleModal={handleModal}
        />
      )}
    </div>
  );
};

export default RegistPage;
