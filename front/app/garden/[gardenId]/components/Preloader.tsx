import { Scene } from "phaser";
import { tree } from "@/app/dummies";
import { gardenEditStore } from "@/stores/gardenEditStore";

export default class Preloader extends Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.tilemapTiledJSON("mainMap", "/assets/map1.json");
    this.load.image("tileset", "/assets/tileset.png");

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
