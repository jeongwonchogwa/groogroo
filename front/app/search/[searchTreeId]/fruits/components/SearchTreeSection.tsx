import Image from "next/image";
import Button from "@/app/components/Button";

interface Props {
  name: string;
  imageUrl: string;
}
const SearchTreeSection = ({ name, imageUrl }: Props) => {
  return (
    <div className="w-full h-full">
      <div className="mx-7">
        <Button color="primary" label={name} />
      </div>
      <div className="h-full">
        <div className="h-[200px] mt-7 flex justify-center">
          <Image src={imageUrl} width={250} height={100} alt="나무" />
        </div>
      </div>
    </div>
  );
};

export default SearchTreeSection;
