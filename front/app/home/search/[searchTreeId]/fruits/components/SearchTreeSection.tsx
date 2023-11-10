import Image from "next/image";
import Button from "@/app/components/Button";
import { searchTreeStore } from "@/stores/searchTreeInfo";

const SearchTreeSection = () => {
  const { searchTreeInfoData } = searchTreeStore();
  return (
    <>
      {searchTreeInfoData?.imageUrl && (
        <div className="w-full h-full">
          <div className="mx-7">
            <Button color="primary" label={searchTreeInfoData.name} />
          </div>
          <div className="h-[200px] mt-7 flex justify-center">
            <Image src={searchTreeInfoData.imageUrl} width={250} height={100} alt="나무" />
          </div>
        </div>
      )}
    </>
  );
};

export default SearchTreeSection;
