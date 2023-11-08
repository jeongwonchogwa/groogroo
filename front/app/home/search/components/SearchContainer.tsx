import Frame from "@/app/components/Frame";
import { Tree } from "@/app/types";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SearchContainerProp {
  searchData: Tree[];
}

const SearchContainer = ({ searchData }: SearchContainerProp) => {
  const router = useRouter();
  return (
    <div className="w-full h-fit">
      {/* 여기부터 frame에 들어갈거야 */}
      {/* height 값을 어떻게 처리해야하는지를 모르겠네... */}
      <Frame
        height={500}
        content={
          <div className="h-full bg-white overflow-scroll">
            {searchData.map((data, i) => (
              // {/* 여기에 클릭 이벤트 걸어야해 */}
              <div key={i} onClick={() => router.push(`/home/${data.id}`)} className="border-b-2 py-3 px-2">
                <div className="flex flex-row h-full w-full items-center">
                  <div className="w-[60px] h-[60px]">
                    <div className="w-[60px] h-[60px] rounded-full border-[1px] shadow bg-white flex justify-center">
                      <Image width={40} height={40} src={data.imageUrl} alt="나무" />
                    </div>
                  </div>
                  <div className="flex flex-col h-full ml-4">
                    <p className=" font-nexonGothic_Medium my-auto">{data.name}</p>
                    <p className="font-nexonGothic_Light text-sm  my-auto"></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        }
      />
    </div>
  );
};

export default SearchContainer;
