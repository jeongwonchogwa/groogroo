import Button from "./components/Button";


const Create = () => {
	

  return (
    <div
      className="w-[430px] h-[932px] bg-cover bg-center bg-no-repeat relative flex justify-center items-center"
      style={{ backgroundImage: 'url("/assets/images/background_home.png")' }}
    >    
      <div className="w-[390px] h-[720px] absolute top-[440px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="w-[390px] h-[120px] flex flex-col items-center">
          <p className="font-bitBit text-[48px]" style={{ marginBottom: 0 }}>
            내 나무 만들기
          </p>
          <p className="font-nexonGothic text-[18px] mt-[10px]" style={{ marginBottom: 0 }}>
            AI 처리를 통해 나만의 나무를 만들 수 있답니다!
          </p>
        </div>
        <div className="w-[390px] h-[500px] border-[3px] flex justify-center">
          <div className="w-[290px] flex flex-row mr-[15px] ml-[5px]">
						<div className="my-auto">
							<div className="w-[5px] h-[490px] bg-black" />
						</div>
						<div className="w-[290px] flex flex-col">
							<div className="w-[290px] h-[5px] bg-black"></div>
							<div className="w-[290px] h-[490px] flex items-center justify-center bg-white">
							</div>
							<div className="w-[290px] h-[5px] bg-black"></div>
						</div>
						<div className="my-auto">
							<div className="w-[5px] h-[490px] bg-black" />
						</div>
					</div>
        </div>
        <div className="w-[320px] h-[50px] mt-[30px] flex justify-between">
          <div className="w-[150px] h-[50px]">
            <Button color="primary" label="프리셋 보기"/>
          </div>
          <div className="w-[150px] h-[50px]">
            <Button color="primary" label="나무 생성 하기"/>
          </div>
        </div>
      </div>
		</div>
  );
;}

export default Create;
