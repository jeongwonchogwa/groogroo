import Frame from "@/app/components/Frame";
import Image from "next/image";

interface SearchBarProps {
  name?: string;
  value?: string;
  handleInput?: (e: any) => void;
  handleSearch: () => void;
}

const SearchBar = ({ name, value, handleInput, handleSearch }: SearchBarProps) => {
  return (
    <div className="w-full">
      <div className="flex flex-col">
        <p
          className="text-center text-white font-bitBit text-2xl mb-1"
          style={{ textShadow: "-3px 0px black, 0px 3px  black, 3px 0px  black, 0px -3px black" }}
        >
          나무 검색
        </p>
        <div className="h-[50px]">
          <Frame
            height={40}
            content={
              <div className="w-full flex flex-row h-[40px]">
                <input
                  type="text"
                  id="search"
                  name={name}
                  value={value}
                  onChange={handleInput}
                  className="px-2 py-1 outline-none border-r-[5px] border-r-frame-border font-nexonGothic_Medium w-full"
                  placeholder="검색할 나무를 입력하세요"
                ></input>
                <div className="h-full flex bg-white">
                  <div
                    onClick={() => {
                      handleSearch();
                      console.log("검색버튼 클릭");
                    }}
                    className="w-8 h-full flex align-middle justify-center"
                  >
                    <Image src="/assets/images/search.svg" width={24} height={24} alt="search"></Image>
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
