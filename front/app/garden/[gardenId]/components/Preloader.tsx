import { Scene } from "phaser";
import { treeList } from "@/app/dummies";
import { Garden, Tree } from "@/app/types";

interface Props {
  garden: Garden;
  // myTree: Tree;
}

export default class Preloader extends Scene {
  private garden: Garden;
  // private myTree: Tree;
  constructor(props: Props) {
    super("preloader");
    // this.myTree = props.myTree;
    this.garden = props.garden;
  }

  preload() {
    console.log("Phaser에 렌더링 될 정원");
    console.log(this.garden);

    //맵 불러오기
    this.load.tilemapTiledJSON(
      "mainMap",
      "/assets/map" + this.garden.mapType + ".json"
    );

    //사용하는 타일맵. 한종류밖에 없음.
    this.load.image("tileset", "/assets/tileset.png");

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
    this.garden.treePos?.forEach((tree) => {
      console.log(tree);
      this.load.spritesheet(tree.name, tree.imageUrl, {
        frameWidth: 128,
        frameHeight: 128,
      });
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
