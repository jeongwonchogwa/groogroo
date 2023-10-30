import Image from "next/image";

const GardenFooter = () => {
  return (
    <div className="flex justify-between">
      <Image
        alt="user"
        src={"/assets/images/plus.png"}
        width={42}
        height={42}
      />
      <div className="flex flex-row-reverse gap-5">
        <Image
          alt="user"
          src={"/assets/images/tree.png"}
          width={42}
          height={42}
        />
        <Image
          alt="user"
          src={"/assets/images/flower.png"}
          width={42}
          height={42}
        />
      </div>
    </div>
  );
};

export default GardenFooter;
