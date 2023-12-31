"use client";

import PixelCard from "@/app/components/PixelCard";
import { Preset, Tree } from "@/app/types";
import { useSearchParams } from "next/navigation";
import UpdateName from "./updateName";
import UpdatePreset from "./updatePreset";
import { useQuery } from "@tanstack/react-query";

interface UpdateContainerProps {
  userTree: Tree;
  data: Preset; // 클릭된 나무 데이터
  width: number; // 모달 너비를 위해...
}

const UpdateContainer = ({ userTree, data, width }: UpdateContainerProps) => {
  const params = useSearchParams();
  const type = params.get("type");

  return (
    <div className="absolute bottom-0">
      <PixelCard
        content={
          <div className="bg-white" style={{ minWidth: "320px", maxWidth: "420px", width: width - 30 }}>
            {/* 프리셋 */}
            {type === "preset" && userTree ? (
              <UpdatePreset userTree={userTree} data={data} />
            ) : (
              userTree && <UpdateName userTree={userTree} />
            )}
          </div>
        }
      />
    </div>
  );
};

export default UpdateContainer;
