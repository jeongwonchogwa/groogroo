import { Scene } from "phaser";
import { tree } from "@/app/dummies";
export default class Preloader extends Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.tilemapTiledJSON("mainMap", "/assets/map1.json");
    this.load.image("tileset", "/assets/tileset.png");
    this.load.image("plusButton", "/assets/images/plus.svg");
    this.load.image("treeButton", "/assets/images/tree.svg");
    this.load.image("flowerButton", "/assets/images/flower.png");
    this.load.image("pixelBox", "/assets/images/pixelBorder.png");
    // this.load.xml(
    //   "bitbit",
    //   "//cdn.df.nexon.com/img/common/font/DNFBitBitv2.otf"
    // );
    tree.trees.forEach((tree) => {
      console.log(tree);
      this.load.spritesheet(tree.name, tree.imageUrl, {
        frameWidth: 128,
        frameHeight: 128,
      });
    });
  }

  create() {
    this.scene.start("gardenScene");
  }
}
