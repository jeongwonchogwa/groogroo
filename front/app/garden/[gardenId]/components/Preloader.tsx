import { Scene } from "phaser";
import { tree } from "@/app/dummies";
import { myTree } from "@/app/dummies";
import { Tree } from "@/app/types";

export default class Preloader extends Scene {
  private myTree: Tree;
  constructor(props: { myTree: Tree }) {
    super("preloader");
    this.myTree = props.myTree;
  }

  preload() {
    this.load.tilemapTiledJSON("mainMap", "/assets/map1.json");
    this.load.image("tileset", "/assets/tileset.png");
    this.load.image("plusButton", "/assets/images/plus.svg");
    this.load.image("treeButton", "/assets/images/tree.svg");
    this.load.image("flowerButton", "/assets/images/flower.png");
    this.load.image("pixelBox", "/assets/images/pixelBorder.png");
    tree.trees.forEach((tree) => {
      console.log(tree);
      this.load.spritesheet(tree.name, tree.imageUrl, {
        frameWidth: 128,
        frameHeight: 128,
      });
    });
    this.load.spritesheet(myTree.name, myTree.imageUrl, {
      frameWidth: 128,
      frameHeight: 128,
    });

    // this.load.spritesheet(this.myTree.name, this.myTree.imageUrl, {
    //   frameWidth: 128,
    //   frameHeight: 128,
    // });
  }

  create() {
    this.scene.start("gardenScene");
  }
}
