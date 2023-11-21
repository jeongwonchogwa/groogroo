import { Scene } from "phaser";
import { Garden, Tree } from "@/app/types";

interface Props {
  garden: Garden;
  // myTree: Tree;
}

export default class Preloader extends Scene {
  private garden: Garden;
  constructor(props: Props) {
    super("preloader");
    this.garden = props.garden;
  }

  preload() {
    //맵 불러오기
    this.load.tilemapTiledJSON(
      "mainMap",
      "/assets/maps/map" + this.garden.mapType + ".json"
    );

    //사용하는 타일맵. 한종류밖에 없음.
    this.load.image("tileset", "/assets/maps/tileset.png");
    this.load.image(
      "tileset_basic_terrain",
      "/assets/maps/tileset_basic_terrain.png"
    );

    //사용할 브금
    this.load.audio("backgroundMusic1", "/assets/music/왕궁의 정원사.mp3");
    this.load.audio("backgroundMusic2", "/assets/music/인형들의 행진.mp3");

    //UI로 사용할 이미지
    this.load.image("plusButton", "/assets/images/plus.svg");
    this.load.image("treeButton", "/assets/images/tree.svg");
    this.load.image("flowerButton", "/assets/images/flower.png");
    this.load.image("pixelBox", "/assets/images/pixelBorder.png");

    //열매
    this.load.image("apple", "/assets/fruits/apple.svg");
    this.load.image("cherry", "/assets/fruits/cherry.svg");
    this.load.image("grape", "/assets/fruits/grape.svg");
    this.load.image("lemon", "/assets/fruits/lemon.svg");
    this.load.image("orange", "/assets/fruits/orange.svg");
    this.load.image("peach", "/assets/fruits/peach.svg");

    //정원에 심어져있는 나무들 스프라이트 생성.
    this.garden.treePos?.forEach((tree, index) => {
      if (tree.name === "" || null) {
        this.load.spritesheet("이름없는 나무" + index, tree.imageUrl, {
          frameWidth: 128,
          frameHeight: 128,
        });
      } else {
        this.load.spritesheet(tree.name, tree.imageUrl, {
          frameWidth: 128,
          frameHeight: 128,
        });
      }
    });

    //정원에 심어져있는 꽃 스프라이트 생성.
    this.garden.flowerPos?.forEach((flower) => {
      this.load.spritesheet("flower" + flower.id, flower.imageUrl, {
        frameWidth: 64,
        frameHeight: 64,
      });
    });
  }

  create() {
    this.scene.start("gardenScene", { garden: this.garden });
  }
}
