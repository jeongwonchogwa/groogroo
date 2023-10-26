interface ButtonProps {
  color: "default" | "white" | "primary" | "secondary" | "secondary-container" | "error";
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

interface buttonConfigType {
  [key: string]: string;
}

const buttonConfig: buttonConfigType = {
  default:
    "bg-text-sub border-b-4 border-r-4 border-[#737373] focus:border-t-4 focus:border-l-4 focus:border-[#737373] focus:border-r-0 focus:border-b-0",
  white:
    "bg-background border-b-4 border-r-4 border-background-container focus:border-t-  4 focus:border-l-4 focus:border-background-container focus:border-r-0 focus:border-b-0",
  primary:
    "bg-primary border-b-4 border-r-4 border-[#225d36] focus:border-t-4 focus:border-l-4 focus:border-[#225d36] focus:border-r-0 focus:border-b-0",
  secondary:
    "bg-point-orange-container border-b-4 border-r-4 border-point-orange focus:border-t-4 focus:border-l-4 focus:border-[#e08e07] focus:border-r-0 focus:border-b-0",
  "secondary-container":
    "bg-[#FFA107] border-b-4 border-r-4 border-[#E08E07] focus:border-t-4 focus:border-l-4 focus:border-[#ffa107] focus:border-r-0 focus:border-b-0",
  error:
    "bg-error border-b-4 border-r-4 border-[#9b2f14] focus:border-t-4 focus:border-l-4 focus:border-[#9b2f14] focus:border-r-0 focus:border-b-0",
};

const Button = ({ color, label, onClick, disabled }: ButtonProps) => {
  return (
    <div className="w-full flex flex-row">
      <div className="my-auto">
        <div className="w-[5px] h-[50px] bg-black" />
      </div>
      <div className="w-full flex flex-col">
        <div className="w-full h-[5px] bg-black"></div>
        <div className="w-full">
          <button
            disabled={disabled}
            className={`w-full focus:outline-none h-[50px] ${buttonConfig[color]}`}
            onClick={onClick}
          >
            <span className={`font-bitBit text-xl ${color === "white" ? "text-black" : "text-white"}`}>{label}</span>
          </button>
        </div>
        <div className="w-full h-[5px] bg-black"></div>
      </div>
      <div className="my-auto">
        <div className="w-[5px] h-[50px] bg-black" />
      </div>
    </div>
  );
};

export default Button;