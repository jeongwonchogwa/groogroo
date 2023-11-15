"use client";

import Button from "@/app/components/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Tree } from "@/app/types";

interface Props {
  data: Tree;
}
const TreeContainer = ({ data }: Props) => {
  const router = useRouter();

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mt-12 mb-7 mx-7">
        <Button color="primary" label={data.name} active={false} />
      </div>
      <div className="w-full h-full flex justify-center">
        <div className="flex flex-col">
          {/* w를 박아 넣는게 맞는지 모르겠어요ㅠㅠ */}
          <div className="w-[calc(100%-50px)] h-[calc(100%-60px)] mx-auto">
            <div className="relative w-full h-full flex justify-center">
              <Image
                className="w-full h-full object-contain"
                src="/assets/images/speech_bubble.svg"
                alt="말풍선"
                width={310}
                height={60}
                priority
              />

              {/* todo 애니메이션 그지같이 넣었네요 더 찾아보세요. */}
              {/* 진심으로. 폴드가 그렇게 너비가 좁다고? */}
              <p className="absolute h-full py-8 bottom-0 inset-x-0 pl-7 animate-typing overflow-hidden whitespace-nowrap font-neoDunggeunmo_Pro text-sm">
                나무를 클릭해 열매를 확인해보세요!!
              </p>
            </div>
          </div>
          <div className="h-full">
            <div className="h-[300px] flex justify-center">
              <Image
                onClick={() => {
                  router.push(`/home/${data.id}`);
                }}
                src={data.imageUrl}
                alt="나무테스트"
                width={300}
                height={250}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeContainer;
