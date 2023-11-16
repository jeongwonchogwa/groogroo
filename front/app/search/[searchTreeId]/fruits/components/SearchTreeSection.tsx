import Image from "next/image";
import Button from "@/app/components/Button";
import RandomFruitImages from "@/app/components/RandomFruitImages";

interface Props {
  name: string;
  imageUrl: string;
  fruitsCount: number;
}

const SearchTreeSection = ({ name, imageUrl, fruitsCount }: Props) => {
  return (
    <div className="w-full h-full">
      <div className="mx-7">
        <Button color="primary" label={name} />
      </div>
      <div className="h-full w-full flex justify-center">
        <div className="h-[250px] mt-7 mx-auto">
          <div className="w-full h-full relative flex justify-center items-center">
            <div className="relative w-[250px] h-[250px]">
              <Image
                src={imageUrl}
                width={250}
                height={250}
                alt="나무"
                className="z-10 absolute"
              />
            </div>

            <RandomFruitImages
              isFruitDetail={true}
              fruitsCount={fruitsCount}
              width={300}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchTreeSection;
