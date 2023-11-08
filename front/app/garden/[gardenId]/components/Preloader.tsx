import { Scene } from "phaser";
import { treeList } from "@/app/dummies";
import { Garden, Tree } from "@/app/types";

interface Props {
  garden: Garden;
  myTree: Tree;
}

export default class Preloader extends Scene {
  private garden: Garden;
  private myTree: Tree;
  constructor(props: Props) {
    super("preloader");
    this.myTree = props.myTree;
    this.garden = props.garden;
  }

  preload() {
    this.load.tilemapTiledJSON("mainMap", this.garden.imageUrl);
    this.load.image("tileset", "/assets/tileset.png");
    this.load.image("plusButton", "/assets/images/plus.svg");
    this.load.image("treeButton", "/assets/images/tree.svg");
    this.load.image("flowerButton", "/assets/images/flower.png");
    this.load.image("pixelBox", "/assets/images/pixelBorder.png");
    treeList.trees.forEach((tree) => {
      console.log(tree);
      this.load.spritesheet(tree.name, tree.imageUrl, {
        frameWidth: 128,
        frameHeight: 128,
      });
    });
    this.load.spritesheet(this.myTree.name, this.myTree.imageUrl, {
      frameWidth: 128,
      frameHeight: 128,
    });
  }

  create() {
    this.scene.start("gardenScene", { garden: this.garden });
  }
}
