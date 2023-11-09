"use client";

import Frame from "@/app/components/Frame";
import { Tree } from "@/app/types";
import { searchTreeStore } from "@/stores/searchTreeInfo";
import { userTreeStore } from "@/stores/userTreeStore";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SearchContainerProp {
  searchData: Tree[];
}

const SearchContainer = ({ searchData }: SearchContainerProp) => {
  console.log(searchData);
  const { userTree } = userTreeStore();
  const { setSearchTreeInfo } = searchTreeStore();
  const router = useRouter();
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
                  // {/* 여기에 클릭 이벤트 걸어야해 */}
                  // <Link
                  //   key={i}
                  //   style={{ color: "black" }}
                  //   href={
                  //     data.id === userTree?.id
                  //       ? { pathname: `/home/${data.id}` }
                  //       : {
                  //           pathname: `/home/search/${data.id}`,
                  //           query: { data: JSON.stringify(data) },
                  //         }
                  //   }
                  //   as={data.id === userTree?.id ? `/home/${data.id}` : `/home/search/${data.id}`}
                  // >
                  <div
                    key={i}
                    onClick={() => {
                      {
                        data.id !== userTree?.id && setSearchTreeInfo(data);
                      }
                      {
                        data.id === userTree?.id
                          ? router.push(`/home/${data.id}`)
                          : router.push(`/home/search/${data.id}`);
                      }
                    }}
                    className="border-b-2 py-3 px-2"
                  >
                    <div className="flex flex-row h-full w-full items-center">
                      <div className="w-[60px] h-[60px]">
                        <div className="w-[60px] h-[60px] rounded-full border-[1px] shadow bg-white flex justify-center">
                          <Image width={40} height={40} src={data.imageUrl} alt="나무" />
                        </div>
                      </div>
                      <div className="flex flex-col h-full ml-4">
                        <p className=" font-nexonGothic_Medium my-auto">{data.name}</p>
                        <p className="font-nexonGothic_Light text-sm  my-auto">{data.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            }
          />
        </div>
      ) : (
        <div className="h-full">
          <div className="w-full h-full flex justify-center mx-3">
            <Image src="/assets/images/cat_pixel.svg" width={80} height={104} alt="고양이_픽셀" />
            <div className="py-[200px] h-full my-auto">
              <div className="nes-balloon from-left flex items-center ">
                <p className=" font-neoDunggeunmo_Pro mt-[-5px]">검색어를 입력하세요!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchContainer;
