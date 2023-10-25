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
    console.log("메인씬 실행");
    const map = this.make.tilemap({ key: "mainMap" });
    map.addTilesetImage("Overworld", "Overworld");
    // map.layers.forEach((layer, index) => {
    //   map.createLayer(index, "Overworld", 0, 0);
    // });

    const groundLayer = map.createLayer("Tile Layer 1", "Overworld", 0, 0);
    const borderLayer = map.createLayer("Tile Layer 2", "Overworld", 0, 0);
    const TopLayer = map.createLayer("Tile Layer 3", "Overworld", 0, 0);
    // const container = this.add.container(400, 300);
    // container.setSize(32, 32);
    // container.setInteractive({ draggable: true });

    const heroSprite = this.physics.add.sprite(0, 0, "hero").setScale(0.25);
    // .setInteractive({ draggable: true });
    // this.cameras.main.startFollow(heroSprite, true);
    // this.cameras.main.setFollowOffset(-heroSprite.width, -heroSprite.height);

    // container.add(heroSprite);
    // container.on("drag", (pointer, dragX, dragY) =>
    //   container.setPosition(dragX, dragY)
    // );
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
