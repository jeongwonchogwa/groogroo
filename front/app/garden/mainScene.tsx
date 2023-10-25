import { Scene } from "phaser";
// @ts-ignore
import AnimatedTiles from "phaser-animated-tiles-phaser3.5/dist/AnimatedTiles.min.js";
export default class MainScene extends Scene {
  private gridEngine!: any;

  constructor() {
    super("mainScene");
    // bootGame : 이 scene의 identifier
  }

  preload() {
    this.load.scenePlugin(
      "animatedTiles",
      AnimatedTiles,
      "animatedTiles",
      "animatedTiles"
    );
  }

  create() {
    const map = this.make.tilemap({ key: "mainMap" });
    map.addTilesetImage("Overworld", "Overworld");
    map.layers.forEach((layer, index) => {
      map.createLayer(index, "Overworld", 0, 0);
    });

    const heroSprite = this.physics.add.sprite(0, 0, "hero").setScale(0.25);
    this.cameras.main.setBackgroundColor("#f1f100");
    this.cameras.main.setZoom(window.innerWidth / 480);
    // this.cameras.main.setSize(window.innerHeight / 320);

    // console.log(this.cameras.main.worldView);
    console.log(this.cameras.main.width);
    this.cameras.main.setPosition(0, 0);
    this.cameras.main.startFollow(heroSprite, true);
    this.cameras.main.setFollowOffset(-heroSprite.width, -heroSprite.height);

    const gridEngineConfig = {
      characters: [
        {
          id: "hero",
          sprite: heroSprite,
          startPosition: { x: 10, y: 10 },
        },
      ],
    };
    // @ts-ignore
    this.sys.animatedTiles.init(map);

    this.gridEngine.create(map, gridEngineConfig);
  }

  update() {
    const cursors = this.input.keyboard?.createCursorKeys();
    if (cursors?.left.isDown) {
      this.gridEngine.move("hero", "left");
    } else if (cursors?.right.isDown) {
      this.gridEngine.move("hero", "right");
    } else if (cursors?.down.isDown) {
      this.gridEngine.move("hero", "down");
    } else if (cursors?.up.isDown) {
      this.gridEngine.move("hero", "up");
    }
  }
}
