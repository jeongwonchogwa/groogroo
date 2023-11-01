import Image from "next/image";

// todo. 구성이 뭔가 너무 하드코딩임. 추후 수정이 필요할 것 같은데
const SearchBar = () => {
  return (
    <div className="w-full h-full">
      <div className="flex flex-col">
        <p
          className="text-center text-white font-bitBit text-2xl mb-1"
          style={{ textShadow: "-3px 0px black, 0px 3px  black, 3px 0px  black, 0px -3px black" }}
        >
          정원 검색
        </p>
        <div className="w-full flex flex-row">
          <div className="my-auto">
            <div className="w-[5px] h-[30px]  bg-frame-border" />
          </div>
          <div className="w-full flex flex-col">
            <div className="w-full h-[5px] bg-frame-border"></div>
            <div className="w-full flex flex-row h-[30px]">
              <input
                className="px-2 py-1 outline-none border-r-[5px] border-r-frame-border font-nexonGothic_Medium w-full"
                placeholder="검색할 정원을 입력하세요"
              ></input>
              <div className="h-full flex bg-white">
                <div
                  onClick={() => {
                    console.log("검색버튼 클릭");
                  }}
                  className="w-8 h-full flex align-middle justify-center"
                >
                  <Image src="/assets/images/search.svg" width={24} height={24} alt="search"></Image>
                </div>
              </div>
            </div>
            <div className="w-full h-[5px]  bg-frame-border"></div>
          </div>
          <div className="my-auto">
            <div className="w-[5px] h-[30px]  bg-frame-border" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
