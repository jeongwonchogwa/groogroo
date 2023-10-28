import IconButton from "@/app/components/IconButton";
import ImageContainer from "@/app/components/ImageContainer";

const RegistTemplateSection = () => {
  return (
    <div className="flex flex-col mb-10">
      <div className="flex justify-start font-neoDunggeunmo_Pro text-lg mb-2">정원의 기본 템플릿을 설정해주세요!</div>
      <div className="flex w-full flex-row">
        <div className="mx-1 my-auto">
          <IconButton iconSrc="arrow" />
        </div>
        <ImageContainer src="/cat.jpg" />
        <div className="mx-1 my-auto">
          <IconButton iconSrc="arrow" rotate={true} />
        </div>
      </div>
    </div>
  );
};

export default RegistTemplateSection;
