interface RegistDescriptionSectionProps {
  name: string;
  value: string;
  onChange: (e: any) => void;
}

const RegistDescriptionSection = ({ name, value, onChange }: RegistDescriptionSectionProps) => {
  return (
    <div className="flex flex-col mb-5">
      <div className="flex justify-start font-neoDunggeunmo_Pro">정원 소개</div>
      <div className="w-full">
        <textarea
          id="description"
          name={name}
          value={value}
          onChange={onChange}
          className="nes-textarea h-[70px] !font-nexonGothic !px-1"
          placeholder="정원을 소개해주세요!"
        />
      </div>
    </div>
  );
};

export default RegistDescriptionSection;
