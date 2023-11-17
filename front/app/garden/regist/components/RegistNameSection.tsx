interface RegistNameSectionProps {
  name: string;
  value: string;
  onChange: (e: any) => void;
}

const RegistNameSection = ({
  name,
  value,
  onChange,
}: RegistNameSectionProps) => {
  return (
    <div className="flex flex-col mb-5">
      <div className="flex justify-start font-neoDunggeunmo_Pro text-lg">
        정원 이름
      </div>
      <div className="w-full">
        <input
          type="text"
          id="name"
          name={name}
          value={value}
          onChange={onChange}
          className="nes-input h-[40px] !font-nexonGothic !px-1"
          placeholder="정원 이름을 정해주세요!"
        />
        {value.length > 10 && (
          <p className="mb-0 mt-1 text-error font-nexonGothic_Medium text-xs">
            * 정원 이름은 최대 10글자 이내로 정해주세요
          </p>
        )}
      </div>
    </div>
  );
};

export default RegistNameSection;
