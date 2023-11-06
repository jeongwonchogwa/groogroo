interface RegistCapacitySectionProps {
  name: string;
  onChange: (e: any) => void;
  value: number;
}

const RegistCapacitySection = ({ name, onChange, value }: RegistCapacitySectionProps) => {
  return (
    <div className="flex flex-row mb-5">
      <div className="w-full my-auto font-neoDunggeunmo_Pro text-lg">정원 최대 인원 : </div>
      <div className="w-full">
        <input
          type="number"
          id="capacity"
          name={name}
          value={value}
          onChange={onChange}
          className="nes-input h-[40px] !font-nexonGothic !px-1"
        />
      </div>
    </div>
  );
};

export default RegistCapacitySection;
