import { Scene } from "phaser";

export default class Preloader extends Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.tilemapTiledJSON("mainMap", "assets/map1.json");
    this.load.image("Overworld", "assets/Overworld.png");

    this.load.spritesheet("hero", "assets/tree.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
  }

  create() {
    console.log("프리로더 실행");
    this.scene.start("mainScene");
  }
}
