import { Scene } from "phaser";
// @ts-ignore
import AnimatedTiles from "phaser-animated-tiles-phaser3.5/dist/AnimatedTiles.min.js";

export default class MainScene extends Scene {
  private gridEngine!: any;
  private heroSprite!: Phaser.Physics.Arcade.Sprite;
  private moveCheck!: boolean;
  private spriteBox!: Phaser.GameObjects.Graphics;
  private spriteContainer!: Phaser.GameObjects.Container;
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

    this.heroSprite = this.physics.add.sprite(0, 0, "hero").setScale(0.25);

    this.spriteBox = this.add.graphics();

    const color = 0xffff00;
    const thickness = 2;
    const alpha = 1;

    this.spriteBox.lineStyle(thickness, color, alpha);

    this.spriteBox.strokeRect(0, 0, 32, 32);

    // this.spriteContainer = this.physics.add.image() container(100, 100, [
    //   this.heroSprite,
    //   this.spriteBox,
    // ]);

    this.cameras.main.setBackgroundColor("#1E7CB8");
    this.moveCheck = false;
    if (window.innerHeight > window.innerWidth) {
      console.log("높이가 너비보다 더큼" + window.innerHeight / 320 + "배");
      this.cameras.main.setZoom(window.innerHeight / 320);
    } else {
      console.log("너비가 높이보다 더 큼" + window.innerWidth / 480 + "배");
      this.cameras.main.setZoom(window.innerWidth / 480);
    }
    console.log(this.cameras.main.width);
    this.cameras.main.setPosition(0, 0);
    this.cameras.main.startFollow(this.heroSprite, true);
    this.cameras.main.setFollowOffset(-8, -16);

    this.heroSprite.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, 32, 32),
      Phaser.Geom.Rectangle.Contains
    );

    const gridEngineConfig = {
      characters: [
        {
          id: "hero",
          sprite: this.heroSprite,
          startPosition: { x: 15, y: 10 },
          // offsetX: 8,
          // offsetY: 4,
        },
      ],
    };

    // @ts-ignore
    this.sys.animatedTiles.init(map);
    this.cameras.main.scrollY = 0;
    this.gridEngine.create(map, gridEngineConfig);
  }

  update() {
    //스프라이트와 키입력 변수
    const sprite = this.heroSprite;
    const cursors = this.input.keyboard?.createCursorKeys();

    //스프라이트 이동 속도
    this.gridEngine.setSpeed("hero", 32);
    //카메라 추적 로직.
    //맵과 스크린 테두리가 맞을시 카메라 멈추기.
    //다시 범위에 들어오면 추적
    //sprite.x => 맵에서 x축 위치  즉 확대된 배율만큼 곱해줘야함? 나눠줘야함?

    if (this.moveCheck) {
      if (
        ((sprite.x + sprite.width / 8) * this.cameras.main.zoom <=
          window.innerWidth / 2 ||
          (480 - (sprite.x + sprite.width / 8)) * this.cameras.main.zoom <
            window.innerWidth / 2) &&
        ((sprite.y + sprite.height / 8) * this.cameras.main.zoom <=
          window.innerHeight / 2 ||
          (320 - (sprite.y + sprite.height / 8)) * this.cameras.main.zoom <
            window.innerHeight / 2)
      ) {
        // console.log(" x y 모두 범위 밖 추적 멈춤");
        this.cameras.main.stopFollow();
      } else if (
        (sprite.x + sprite.width / 8) * this.cameras.main.zoom <=
          window.innerWidth / 2 ||
        (480 - (sprite.x + sprite.width / 8)) * this.cameras.main.zoom <
          window.innerWidth / 2
      ) {
        // console.log("x 값 범위 밖");
        this.cameras.main.startFollow(sprite, true);
        this.cameras.main.setFollowOffset(
          // 10,
          window.innerWidth / (2 * this.cameras.main.zoom) - (480 - sprite.x),
          -this.heroSprite.height / 8
        );

        // console.log("스프라이트 위치" + sprite.x);
        // console.log(
        //   "맵 경계랑 거리" + (480 - sprite.x) * this.cameras.main.zoom
        // );
        // console.log("스크린 반띵 크기" + window.innerWidth / 2);
        // console.log(this.cameras.main.followOffset);
      } else if (
        (sprite.y + sprite.height / 8) * this.cameras.main.zoom <=
          window.innerHeight / 2 ||
        (320 - (sprite.y + sprite.height / 8)) * this.cameras.main.zoom <
          window.innerHeight / 2
      ) {
        // console.log("y 값 범위 밖");
        this.cameras.main.startFollow(sprite, true);
        this.cameras.main.setFollowOffset(
          // sprite.x - 224 - sprite.width / 8,
          -this.heroSprite.width / 8,
          sprite.y - 144 - sprite.height / 8
        );

        // console.log(this.cameras.main.followOffset);
      }
    }

    //키 입력시 좌표 이동.
    //moveCheck를 통해서 꾹누르고있어도 한칸만 가도록 제한
    if (cursors?.left.isDown && !this.moveCheck) {
      this.gridEngine.move("hero", "left");
      this.moveCheck = true;
      console.log(this.gridEngine.getCollisionGroups("hero"));
    } else if (cursors?.right.isDown && !this.moveCheck) {
      this.gridEngine.move("hero", "right");
      this.moveCheck = true;
      console.log(this.gridEngine.getPosition("hero"));
    } else if (cursors?.down.isDown && !this.moveCheck) {
      this.gridEngine.move("hero", "down");
      this.moveCheck = true;
      console.log(this.gridEngine.getPosition("hero"));
    } else if (cursors?.up.isDown && !this.moveCheck) {
      this.gridEngine.move("hero", "up");
      this.moveCheck = true;
      console.log(this.gridEngine.getPosition("hero"));
    }

    if (
      !cursors?.left.isDown &&
      !cursors?.right.isDown &&
      !cursors?.up.isDown &&
      !cursors?.down.isDown &&
      this.moveCheck
    ) {
      this.moveCheck = false;
    }
  }
}
