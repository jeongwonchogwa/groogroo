interface ButtonProps {
    color: "default" | "white" | "primary" | "secondary" | "secondary-container" | "error";
    label: string;
    onClick?: () => void;
    // onClickText를 넣는게 맞나?
    onClickText?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    active?: boolean;
  }
  
  const buttonActiveConfig = {
    default: `bg-text-sub border-b-4 border-r-4 border-[#737373] active:border-t-4 active:border-l-4 active:border-[#737373] active:border-r-0 active:border-b-0`,
    white:
      "bg-background border-b-4 border-r-4 border-background-container active:border-t-4 active:border-l-4 active:border-background-container active:border-r-0 active:border-b-0",
    primary:
      "bg-primary border-b-4 border-r-4 border-[#225d36] active:border-t-4 active:border-l-4 active:border-[#225d36] active:border-r-0 active:border-b-0",
    secondary:
      "bg-point-orange-container border-b-4 border-r-4 border-point-orange active:border-t-4 active:border-l-4 active:border-[#e08e07] active:border-r-0 active:border-b-0",
    "secondary-container":
      "bg-[#FFA107] border-b-4 border-r-4 border-[#E08E07] active:border-t-4 active:border-l-4 factiveocus:border-[#ffa107] active:border-r-0 active:border-b-0",
    error:
      "bg-error border-b-4 border-r-4 border-[#9b2f14] active:border-t-4 active:border-l-4 active:border-[#9b2f14] active:border-r-0 active:border-b-0",
  };
  
  const buttonNotActiveConfig = {
    default: `bg-text-sub border-b-4 border-r-4 border-[#737373]`,
    white: "bg-background border-b-4 border-r-4 border-background-container",
    primary: "bg-primary border-b-4 border-r-4 border-[#225d36]",
    secondary: "bg-point-orange-container border-b-4 border-r-4 border-point-orange",
    "secondary-container": "bg-[#FFA107] border-b-4 border-r-4 border-[#E08E07]",
    error: "bg-error border-b-4 border-r-4 border-[#9b2f14]",
  };
  
  const Button = ({ color, label, onClick, onClickText, disabled, active = true }: ButtonProps) => {
    const buttonConfig = active ? buttonActiveConfig[color] : buttonNotActiveConfig[color];
  
    return (
      <div className="w-full flex flex-row">
        <div className="my-auto">
          <div className="w-[5px] h-[35px] bg-black" />
        </div>
        <div className="w-full flex flex-col">
          <div className="w-full h-[5px] bg-black"></div>
          <div className="w-full">
            <button
              disabled={disabled}
              // overflow를 넣는게 맞을까요?
              className={`overflow-auto w-full focus:outline-none h-[35px] ${buttonConfig}`}
              // 이게 뭔..
              onClick={onClick ? onClick : onClickText}
            >
              <span className={`font-bitBit text-xl ${color === "white" ? "text-black" : "text-white"}`}>{label}</span>
            </button>
          </div>
          <div className="w-full h-[5px] bg-black"></div>
        </div>
        <div className="my-auto">
          <div className="w-[5px] h-[35px] bg-black" />
        </div>
      </div>
    );
  };
  
  export default Button;
  