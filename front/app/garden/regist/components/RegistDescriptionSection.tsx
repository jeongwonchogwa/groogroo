const RegistDescriptionSection = () => {
  return (
    <div className="flex flex-col mb-8">
      <div className="flex justify-start font-neoDunggeunmo_Pro text-lg">정원 소개</div>
      <div className="w-full">
        <input
          type="text"
          id="name_field"
          className="nes-input h-[40px] !font-nexonGothic !px-1"
          placeholder="정원을 소개해주세요!"
        />
      </div>
    </div>
  );
};

export default RegistDescriptionSection;
