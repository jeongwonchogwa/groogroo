import Frame from "@/app/components/Frame";
import Image from "next/image";

const SearchContainer = () => {
  return (
    <div className="w-full h-[610px]">
      {/* 여기부터 frame에 들어갈거야 */}
      <Frame
        height={600}
        content={
          <div className="h-full bg-white overflow-scroll">
            {/* 여기에 클릭 이벤트 걸어야해 */}
            <div onClick={() => console.log("클릭이벤트")} className="border-b-2 py-3 px-2">
              <div className="flex flex-row h-full w-full items-center">
                <div className="w-[60px] h-[60px]">
                  <div className="w-[60px] h-[60px] rounded-full border-[1px] shadow bg-white flex justify-center">
                    <Image width={40} height={40} src="/assets/trees/tree[0].svg" alt="나무" />
                  </div>
                </div>
                <div className="flex flex-col h-full ml-4">
                  <p className=" font-nexonGothic_Medium my-auto">나무이름열두글자지금은몇</p>
                  <p className="font-nexonGothic_Light text-sm  my-auto">aaa123asdㄴㅇㄹ@naver.com</p>
                </div>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default SearchContainer;
