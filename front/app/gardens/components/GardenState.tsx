import Image from "next/image";

interface Props {
  state: "WAIT" | "ACCEPT";
}

const GardenState = ({ state }: Props) => {
  const stateText = state === "ACCEPT" ? "내 정원" : "대기중";
  return (
    <div className="absolute z-20 top-[10px] right-[5px]">
      <div className="bg-primary-container rounded-lg w-fit p-2 font-neoDunggeunmo_Pro text-sm  flex flex-row text-white border-solid border-2 border-black">
        <div className="w-4 my-auto mr-1">
          <Image
            src={
              state === "ACCEPT"
                ? "/assets/images/state/accept.svg"
                : "/assets/images/state/hourglass.svg"
            }
            alt="모래시계"
            width={128}
            height={108}
          />
        </div>
        <span>{stateText}</span>
      </div>
    </div>
  );
};

export default GardenState;
