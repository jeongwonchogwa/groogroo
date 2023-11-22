import Image from "next/image";
import { useState, useEffect } from "react";

interface Props {
  fruitsCount: number;
  width: number;
  isFruitDetail?: boolean;
}

const RandomFruitImages = ({ isFruitDetail = false, fruitsCount, width }: Props) => {
  const fruitImages = [
    "apple.svg",
    "banana.svg",
    "cherry.svg",
    "grape.svg",
    "lemon.svg",
    "coconut.svg",
    "orange.svg",
    "peach.svg",
  ];

  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  useEffect(() => {
    let imageCount;
    if (fruitsCount >= 19) {
      imageCount = 5;
    } else if (fruitsCount >= 14) {
      imageCount = 4;
    } else if (fruitsCount >= 9) {
      imageCount = 3;
    } else if (fruitsCount >= 5) {
      imageCount = 2;
    } else if (fruitsCount >= 1) {
      imageCount = 1;
    } else {
      imageCount = 0;
    }

    const randomImages = [];
    for (let i = 0; i < imageCount; i++) {
      const randomIndex = Math.floor(Math.random() * fruitImages.length);
      randomImages.push(fruitImages[randomIndex]);
    }
    setSelectedImages(randomImages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fruitsCount]);

  const getImageStyle = (count: number) => {
    switch (count) {
      case 1:
        return `z-20 absolute top-[calc(100%-250px)] left-[calc(100%-210px)]`;
      case 2:
        return `z-20 absolute top-[calc(100%-250px)] right-[calc(100%-210px)]`;
      case 3:
        return `z-20 absolute top-[calc(100%-170px)] left-[calc(100%-230px)]`;
      case 4:
        return `z-20 absolute top-[calc(100%-200px)] left-[calc(100%-170px)]`;
      case 5:
        return `z-20 absolute top-[calc(100%-180px)] right-[calc(100%-240px)]`;
    }
  };

  const getSmallImageStyle = (count: number) => {
    switch (count) {
      case 1:
        return `z-20 absolute top-[30px] left-[90px]`;
      case 2:
        return `z-20 absolute top-[35px] right-[75px]`;
      case 3:
        return `z-20 absolute top-[95px] left-[55px]`;
      case 4:
        return `z-20 absolute top-[85px] left-[110px]`;
      case 5:
        return `z-20 absolute top-[100px] right-[60px]`;
    }
  };
  return (
    <>
      {selectedImages.map((image, index) => (
        <Image
          key={index}
          src={`/assets/fruits/${image}`}
          alt="열매"
          width={isFruitDetail ? 32 : 40}
          height={isFruitDetail ? 32 : 40}
          className={isFruitDetail ? getSmallImageStyle(index + 1) : getImageStyle(index + 1)}
        />
      ))}
    </>
  );
};

export default RandomFruitImages;

// const getImageStyle = (count: number) => {
//   switch (count) {
//     case 1:
//       return `z-20 absolute top-[${width * 0.1}px] left-[${width * 0.5}px]`;
//     case 2:
//       return `z-20 absolute top-[${width * 0.3}px] left-[${width * 0.2}px]`;
//     case 3:
//       return `z-20 absolute top-[${width * 0.5 - width * 0.05}px] right-[${
//         width * 0.5
//       }px]`;
//     case 4:
//       return `z-20 absolute top-[${width * 0.3}px] right-[${width * 0.2}px]`;
//     default:
//       return "z-20 absolute top-[5px] left-[10px]";
//   }
// };
