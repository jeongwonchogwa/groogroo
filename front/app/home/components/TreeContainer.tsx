"use client";
//todo. 이미지 사이즈를 그냥 w, h로 박아넣고 있는데 이게 맞는지 모르게쪄
//트리 이미지를 그냥 박고 있는데 이거 처리 어떻게 할거야??????? 지금 좀 망한거 같은데
//정재웅 얼른 돌아와.
import Button from "@/app/components/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const TreeContainer = () => {
  const router = useRouter();

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mt-12 mb-7 mx-7">
        <Button color="primary" label="나무이름" active={false} />
      </div>
      <div className="w-full h-full flex justify-center">
        <div className="flex flex-col">
          {/* w를 박아 넣는게 맞는지 모르겠어요ㅠㅠ */}
          <div className="w-[340px] h-[80px]">
            <div className="relative w-full h-full flex justify-center">
              <Image
                className="w-full h-full object-contain"
                src="/assets/images/speech_bubble.svg"
                alt="말풍선"
                width={310}
                height={60}
              />
              {/* todo 애니메이션 그지같이 넣었네요 더 찾아보세요. */}
              <p className="absolute h-full py-8 bottom-0 inset-x-0 pl-10 pr-6 animate-typing overflow-hidden whitespace-nowrap font-neoDunggeunmo_Pro">
                나무를 클릭해 열매를 확인해보세요!!
              </p>
            </div>
          </div>
          <div>
            {/* 이미지 클릭하면 페이지 이동이 일어나아 근데 나는 여기서 src에 뭘 넣어야 할지도 모르겠다..  */}
            <Image
              onClick={() => {
                router.push("/home/1");
              }}
              src="/assets/images/testTree.svg"
              alt="나무테스트"
              width={340}
              height={330}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeContainer;
