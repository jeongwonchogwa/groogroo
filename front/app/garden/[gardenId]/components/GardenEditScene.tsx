import { tree } from "@/app/dummies";
import { myTree } from "@/app/dummies";
import { Character } from "@/app/types";
import { Scene } from "phaser";
// @ts-ignore
import AnimatedTiles from "phaser-animated-tiles-phaser3.5/dist/AnimatedTiles.min.js";

export default class GardenEditScene extends Scene {
  private gridEngine!: any;
  private treeSprite!: Phaser.Physics.Arcade.Sprite;
  private moveCheck!: boolean;
  private spriteBox!: Phaser.GameObjects.Graphics;
  private errorSpriteBox!: Phaser.GameObjects.Graphics;
  private defaultSpriteBox!: Phaser.GameObjects.Graphics;
  constructor() {
    super("gardenEditScene");
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
    //맵 생성. 레이어별로 foreach 돌면서.///////////////////////////////////////////////
    const map = this.make.tilemap({ key: "mainMap" });
    map.addTilesetImage("tileset", "tileset");
    map.layers.forEach((layer, index) => {
      map.createLayer(index, "tileset", 0, 0);
    });

    //나무 sprite 목록 생성./////////////////////////////////////////////////////////
    const characters: Character[] = [];
    tree.trees.forEach((tree) => {
      characters.push({
        id: tree.name,
        sprite: this.physics.add
          .sprite(0, 0, tree.name)
          .setDepth(3)
          .setScale(0.25)
          .setInteractive()
          //열매 작성 폼 띄워줄거임.
          .on("pointerdown", () => {
            console.log("누름!");
          }),
        startPosition: { x: tree.x!, y: tree.y! },
        tileHeight: 2,
        tileWidth: 2,
        offsetX: 8,
        offsetY: 16,
      });
    });

    //내 나무 sprite
    this.treeSprite = this.physics.add
      .sprite(0, 0, myTree.name)
      .setScale(0.25)
      .setDepth(4);
    characters.push({
      id: myTree.name,
      sprite: this.treeSprite,
      startPosition: { x: 15, y: 10 },
      tileHeight: 0,
      tileWidth: 0,
      offsetX: 8,
      offsetY: 16,
    });
    this.cameras.main.setBackgroundColor("#1E7CB8");
    this.moveCheck = false;

    //맵 screen 사이즈에 맞춰서 zoom수치 설정. 너비/높이 중 더 큰 사이즈에 맞춰서.
    if (window.innerHeight > window.innerWidth) {
      console.log("높이가 너비보다 더큼" + window.innerHeight / 320 + "배");
      this.cameras.main.setZoom(window.innerHeight / 320);
    } else {
      console.log("너비가 높이보다 더 큼" + window.innerWidth / 480 + "배");
      this.cameras.main.setZoom(window.innerWidth / 480);
    }
    console.log(this.cameras.main.width);
    this.cameras.main.setPosition(0, 0);
    this.cameras.main.startFollow(this.treeSprite, true);
    this.cameras.main.setFollowOffset(-16);

    // this.treeSprite.setInteractive();

    const color = 0xffc76a;
    const errorColor = 0xb83818;
    const thickness = 0.5;
    const alpha = 1;

    this.defaultSpriteBox = this.add.graphics();
    this.defaultSpriteBox.lineStyle(thickness, color, alpha);
    this.defaultSpriteBox.fillStyle(color, 0.5);
    this.defaultSpriteBox.fillRect(0, 0, 32, 32);
    this.defaultSpriteBox.strokeRect(0, 0, 32, 32);
    this.defaultSpriteBox.setDepth(3);

    this.errorSpriteBox = this.add.graphics();
    this.errorSpriteBox.lineStyle(thickness, errorColor, alpha);
    this.errorSpriteBox.fillStyle(errorColor, 0.5);
    this.errorSpriteBox.fillRect(0, 0, 32, 32);
    this.errorSpriteBox.strokeRect(0, 0, 32, 32);
    this.errorSpriteBox.setDepth(3);
    this.errorSpriteBox.setVisible(false);

    this.spriteBox = this.defaultSpriteBox;

    const gridEngineConfig = {
      snapToCell: true,
      characters: characters,
    };

    // @ts-ignore
    this.sys.animatedTiles.init(map);
    this.cameras.main.scrollY = 0;
    this.gridEngine.create(map, gridEngineConfig);
  }

  update() {
    //에셋 배치시 나무, 꽃 테두리 보여주기.
    this.spriteBox.setX(this.treeSprite.x);
    this.spriteBox.setY(this.treeSprite.y);
    this.defaultSpriteBox.setX(this.treeSprite.x);
    this.defaultSpriteBox.setY(this.treeSprite.y);
    this.errorSpriteBox.setX(this.treeSprite.x);
    this.errorSpriteBox.setY(this.treeSprite.y);
    //스프라이트와 키입력 변수
    const sprite = this.treeSprite;
    const cursors = this.input.keyboard?.createCursorKeys();

    //스프라이트 이동 속도
    this.gridEngine.setSpeed("고무고무나무", 32);

    //카메라 추적 로직.
    //맵과 스크린 테두리가 맞을시 카메라 멈추기.
    //다시 범위에 들어오면 추적
    //sprite.x => 맵에서 x축 위치 확대된 배율만큼 곱해줘야함
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
        this.cameras.main.stopFollow();
      } else if (
        (sprite.x + sprite.width / 8) * this.cameras.main.zoom <=
          window.innerWidth / 2 ||
        (480 - (sprite.x + sprite.width / 8)) * this.cameras.main.zoom <
          window.innerWidth / 2
      ) {
        this.cameras.main.startFollow(sprite, true);
        this.cameras.main.setFollowOffset(
          // 10,
          window.innerWidth / (2 * this.cameras.main.zoom) - (480 - sprite.x),
          -this.treeSprite.height / 8
        );
      } else if (
        (sprite.y + sprite.height / 8) * this.cameras.main.zoom <=
          window.innerHeight / 2 ||
        (320 - (sprite.y + sprite.height / 8)) * this.cameras.main.zoom <
          window.innerHeight / 2
      ) {
        this.cameras.main.startFollow(sprite, true);
        this.cameras.main.setFollowOffset(
          // sprite.x - 224 - sprite.width / 8,
          -this.treeSprite.width / 8,
          sprite.y - 144 - sprite.height / 8
        );
      }
    }

    //키 입력시 좌표 이동.
    //moveCheck를 통해서 꾹누르고있어도 한칸만 가도록 제한
    if (cursors?.left.isDown && !this.moveCheck) {
      this.gridEngine.move(myTree.name, "left");
      this.moveCheck = true;

      if (
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(myTree.name).x - 1,
          y: this.gridEngine.getPosition(myTree.name).y,
        }) ||
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(myTree.name).x - 1,
          y: this.gridEngine.getPosition(myTree.name).y + 1,
        }) ||
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(myTree.name).x,
          y: this.gridEngine.getPosition(myTree.name).y,
        }) ||
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(myTree.name).x,
          y: this.gridEngine.getPosition(myTree.name).y + 1,
        })
      ) {
        this.spriteBox = this.errorSpriteBox;
        this.errorSpriteBox.setVisible(true);
        this.defaultSpriteBox.setVisible(false);
      } else {
        this.spriteBox = this.defaultSpriteBox;
        this.errorSpriteBox.setVisible(false);
        this.defaultSpriteBox.setVisible(true);
      }
    } else if (cursors?.right.isDown && !this.moveCheck) {
      this.gridEngine.move(myTree.name, "right");
      this.moveCheck = true;

      if (
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(myTree.name).x + 1,
          y: this.gridEngine.getPosition(myTree.name).y,
        }) ||
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(myTree.name).x + 1,
          y: this.gridEngine.getPosition(myTree.name).y + 1,
        }) ||
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(myTree.name).x + 2,
          y: this.gridEngine.getPosition(myTree.name).y,
        }) ||
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(myTree.name).x + 2,
          y: this.gridEngine.getPosition(myTree.name).y + 1,
        })
      ) {
        this.spriteBox = this.errorSpriteBox;
        this.errorSpriteBox.setVisible(true);
        this.defaultSpriteBox.setVisible(false);
      } else {
        this.spriteBox = this.defaultSpriteBox;
        this.errorSpriteBox.setVisible(false);
        this.defaultSpriteBox.setVisible(true);
      }
    } else if (cursors?.down.isDown && !this.moveCheck) {
      this.gridEngine.move(myTree.name, "down");
      this.moveCheck = true;

      if (
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(myTree.name).x,
          y: this.gridEngine.getPosition(myTree.name).y + 1,
        }) ||
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(myTree.name).x,
          y: this.gridEngine.getPosition(myTree.name).y + 2,
        }) ||
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(myTree.name).x + 1,
          y: this.gridEngine.getPosition(myTree.name).y + 1,
        }) ||
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(myTree.name).x + 1,
          y: this.gridEngine.getPosition(myTree.name).y + 2,
        })
      ) {
        this.errorSpriteBox.setVisible(true);
        this.defaultSpriteBox.setVisible(false);
        this.spriteBox = this.errorSpriteBox;
      } else {
        this.spriteBox = this.defaultSpriteBox;
        this.errorSpriteBox.setVisible(false);
        this.defaultSpriteBox.setVisible(true);
      }
    } else if (cursors?.up.isDown && !this.moveCheck) {
      this.gridEngine.move(myTree.name, "up");
      this.moveCheck = true;

      if (
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(myTree.name).x,
          y: this.gridEngine.getPosition(myTree.name).y - 1,
        }) ||
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(myTree.name).x,
          y: this.gridEngine.getPosition(myTree.name).y,
        }) ||
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(myTree.name).x + 1,
          y: this.gridEngine.getPosition(myTree.name).y - 1,
        }) ||
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(myTree.name).x + 1,
          y: this.gridEngine.getPosition(myTree.name).y,
        })
      ) {
        this.spriteBox = this.errorSpriteBox;
        this.errorSpriteBox.setVisible(true);
        this.defaultSpriteBox.setVisible(false);
      } else {
        this.spriteBox = this.defaultSpriteBox;
        this.errorSpriteBox.setVisible(false);
        this.defaultSpriteBox.setVisible(true);
      }
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
