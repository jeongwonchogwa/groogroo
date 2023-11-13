"use client";

import Frame from "@/app/components/Frame";
import { Tree } from "@/app/types";
import { userTreeStore } from "@/stores/userTreeStore";
import Image from "next/image";
import Link from "next/link";

interface SearchContainerProp {
  searchData: Tree[];
}

const SearchContainer = ({ searchData }: SearchContainerProp) => {
  const { userTree } = userTreeStore();
  return (
    <>
      {searchData.length > 0 ? (
        <div className="w-full h-fit">
          {/* 여기부터 frame에 들어갈거야 */}
          {/* height 값을 어떻게 처리해야하는지를 모르겠네... */}
          <Frame
            height={500}
            content={
              <div className="h-full bg-white overflow-scroll">
                {searchData.map((data, i) => (
                  <Link
                    style={{ color: "black" }}
                    key={i}
                    href={
                      data.id === userTree?.id
                        ? { pathname: `/home/${data.id}` }
                        : {
                            pathname: `/search/result`,
                            query: { name: data.name },
                          }
                    }
                  >
                    <div className="border-b-2 py-3 px-2">
                      <div className="flex flex-row h-full w-full items-center">
                        <div className="w-[60px] h-[60px]">
                          <div className="w-[60px] h-[60px] rounded-full border-[1px] shadow bg-white flex justify-center">
                            <Image
                              width={40}
                              height={40}
                              src={data.imageUrl}
                              alt="나무"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col h-full ml-4">
                          <p className=" font-nexonGothic_Medium my-auto">
                            {data.name}
                          </p>
                          <p className="font-nexonGothic_Light text-sm  my-auto">
                            {data.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            }
          />
        </div>
      ) : (
        <div className="h-fit w-full">
          <Frame
            height={500}
            content={
              <div className="h-full bg-white">
                <div className="flex flex-col justify-center h-full items-center">
                  <Image
                    alt="empty"
                    src="/assets/images/question.svg"
                    width={73}
                    height={99}
                  />
                  <p className="mt-5 font-neoDunggeunmo_Pro text-xl">
                    검색결과가 없습니다!
                  </p>
                </div>
              </div>
            }
          />
        </div>
      )}
    </>
  );
};
export default SearchContainer;
