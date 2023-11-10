"use client";

import Button from "@/app/components/Button";
import NameInput from "@/app/components/NameInput";
import PixelCard from "@/app/components/PixelCard";
import { Preset } from "@/app/types";
import { userTreeStore } from "@/stores/userTreeStore";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

interface UpdateContainerProps {
  data: Preset; // 클릭된 나무 데이터
  width: number; // 모달 너비를 위해...
  value: string; // 바뀐 나무 이름
  onChange: (e: any) => void; //나무 이름 바꾸는 input 함수
  checkTree: number; // 현재 나무이름 중복검사 유효성 검사 했는지 체크
  fetchTreeCheck: () => void; // 유효성 검사, 중복검사 하기 위한 function
  clickChange: () => void; //나무 변경하기 최종 클릭
}

const UpdateContainer = ({
  data,
  width,
  value,
  onChange,
  checkTree,
  fetchTreeCheck,
  clickChange,
}: UpdateContainerProps) => {
  const router = useRouter();
  const params = useSearchParams();
  const type = params.get("type");
  const { userTree } = userTreeStore();
  return (
    <>
      {data && (
        <div className="absolute bottom-0 flex" style={{ width: width - 30 }}>
          <PixelCard
            content={
              <div className="bg-white" style={{ width: width - 30 }}>
                {type === "preset" ? (
                  <div className="flex flex-col p-2 mt-5">
                    <div className=" text-center  font-neoDunggeunmo_Pro text-2xl">변경할 프리셋을 선택하세요</div>
                    <div className="mt-3 p-6">
                      <div className="grid grid-flow-col gap-4">
                        <Button
                          color="error"
                          label="삭제하기"
                          onClick={() => router.back()}
                          disabled={data.treeUserPresetId > 0}
                        />
                        <Button color="secondary" label="변경하기" onClick={clickChange} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {userTree && (
                      <div className="flex flex-col p-2 mt-5">
                        <div className=" text-center  font-neoDunggeunmo_Pro text-2xl">나무의 새 이름을 정해주세요</div>
                        {/* 위치 조정을 이렇게..? 뭔가 이상한데.. */}
                        <div className="px-2 w-full flex flex-col ml-[15px]">
                          <NameInput value={value} onChange={onChange} placeholder={userTree.name} maxlength={12} />
                          {/* 이 친구를 배열을 만들어 처리하는게 나으려나..? */}
                          {checkTree == 1 && (
                            <p className="mt-1 font-nexonGothic_Bold text-lg text-error text-start">
                              나무 이름 양식을 맞춰주세요!
                            </p>
                          )}

                          {checkTree == 2 && (
                            <p className="mt-1 font-nexonGothic_Bold text-lg text-error text-start">
                              이미 사용중인 나무 이름입니다!
                            </p>
                          )}
                          {checkTree == 3 && (
                            <p className="mt-1 font-nexonGothic_Bold text-lg text-primary-container text-start">
                              사용가능한 나무 이름입니다!
                            </p>
                          )}
                          {checkTree == 0 && (
                            <p
                              onClick={fetchTreeCheck}
                              className="mt-1 mr-7 font-nexonGothic_Bold text-lg text-primary text-end"
                            >
                              중복확인
                            </p>
                          )}
                        </div>
                        <div className="px-6 pb-4">
                          <div className="grid grid-flow-col gap-4">
                            <Button color="default" label="취소하기" onClick={() => router.back()} />
                            <Button color="secondary-container" label="변경하기" onClick={clickChange} />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            }
          />
        </div>
      )}
    </>
  );
};

export default UpdateContainer;
