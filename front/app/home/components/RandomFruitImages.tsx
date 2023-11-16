import { useEffect, useState } from "react";
import getFruitImages from "./getFruitsImages";
import Image from "next/image";
import { CSSProperties } from "react";

interface Props {
  fruitsCount: number;
  imageUrl: string;
  width: number;
}

const RandomFruitImages = ({ fruitsCount, imageUrl, width }: Props) => {
  // const [fruitImages, setFruitImages] = useState<string[]>([]);

  const fruitImages = [
    "apple.svg",
    "cherry.svg",
    "grape.svg",
    "lemon.svg",
    "lemon.svg",
    "orange.svg",
    "peach.svg",
  ];

  // useEffect(() => {
  //   const images = getFruitImages();
  //   setFruitImages(images);
  // }, []);

  const imageCount = Math.min(Math.floor(fruitsCount / 5), 4);

  // const imageStyles = (
  //   imageWidth: number,
  //   top: number,
  //   left: number
  // ): CSSProperties => {
  //   return {
  //     width: `${imageWidth / 5}px`,
  //     position: "absolute",
  //     top: `${top}px`,
  //     left: `${left}px`,
  //   };
  // };

  const imageStyles = (
    imageWidth: number,
    top: number,
    left: number
  ): CSSProperties => {
    return {
      width: `${imageWidth / 5}px`,
      position: "absolute",
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 20, // z-index를 높게 설정하여 다른 요소들 위에 표시
    };
  };

  return (
    <>
      {fruitImages.slice(0, imageCount).map((image, index) => (
        <div
          key={index}
          style={imageStyles(width, Math.random() * 100, Math.random() * 100)}
        >
          <Image
            src={`/assets/fruits/${image}`}
            alt="Fruit"
            layout="fill"
            objectFit="contain"
            className="z-20"
          />
        </div>
      ))}
    </>
  );
};

export default RandomFruitImages;
