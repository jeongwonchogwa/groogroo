import { Scene } from "phaser";
// @ts-ignore
import AnimatedTiles from "phaser-animated-tiles-phaser3.5/dist/AnimatedTiles.min.js";
import { tree } from "@/app/dummies";
import { Character } from "@/app/types";

export default class GardenScene extends Scene {
  private gridEngine!: any;
  private startX!: number;
  private startY!: number;
  constructor() {
    super("gardenScene");
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

    //나무sprite 목록 생성./////////////////////////////////////////////////////////
    const characters: Character[] = [];
    tree.trees.forEach((tree) => {
      characters.push({
        id: tree.name,
        sprite: this.physics.add.sprite(0, 0, tree.name).setScale(0.25),
        startPosition: { x: tree.x, y: tree.y },
        tileHeight: 2,
        tileWidth: 2,
        offsetX: 8,
        offsetY: 16,
      });
    });

    //camera 설정 /////////////////////////////////////////////////////////////////
    //zoom, scroll, position 설정.
    this.cameras.main.setBackgroundColor("#1E7CB8");

    // 맵 screen 사이즈에 맞춰서 zoom수치 설정. 너비/높이 중 더 큰 사이즈에 맞춰서.
    if (window.innerHeight >= window.innerWidth) {
      console.log(
        "높이가 너비보다 같거나 더큼" + window.innerHeight / 320 + "배"
      );
      this.cameras.main.setZoom(window.innerHeight / 320);
    } else {
      console.log("너비가 높이보다 더 큼" + window.innerWidth / 480 + "배");
      this.cameras.main.setZoom(window.innerWidth / 480);
    }
    this.cameras.main.setPosition(0, 0);
    this.cameras.main.setScroll(
      240 - (240 * window.innerWidth) / 480,
      160 - (160 * window.innerHeight) / 320
    );
    //맨처음 시작 위치 기준으로 이동 제한하기 위해서 저장
    const startX = this.cameras.main.scrollX;
    const startY = this.cameras.main.scrollY;
    console.log(this.cameras.main.scrollX + " " + this.cameras.main.scrollY);

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      // 마우스 클릭 또는 터치 시작 시의 위치를 저장
      this.startX = pointer.x;
      this.startY = pointer.y;
    });

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) {
        // 마우스 드래그 또는 터치 스와이프 시 스크롤 위치 조정
        const dx = this.startX - pointer.x;
        const dy = this.startY - pointer.y;
        if (
          this.cameras.main.scrollX + dx >=
            startX - 240 + window.innerWidth / (2 * this.cameras.main.zoom) &&
          this.cameras.main.scrollX + dx <=
            startX + 240 - window.innerWidth / (2 * this.cameras.main.zoom)
        ) {
          this.cameras.main.scrollX += dx;
        }
        if (
          this.cameras.main.scrollY + dy >=
            startY + 160 / (2 * this.cameras.main.zoom) &&
          this.cameras.main.scrollY + dy <=
            startY - 160 / (2 * this.cameras.main.zoom)
        ) {
          this.cameras.main.scrollY += dy;
        }

        // 다음 스크롤를 위해 시작 위치 업데이트
        this.startX = pointer.x;
        this.startY = pointer.y;
        console.log(
          this.cameras.main.scrollX + " " + this.cameras.main.scrollY
        );
      }
    });

    const gridEngineConfig = {
      snapToCell: true,
      characters: characters,
    };

    // @ts-ignore
    this.sys.animatedTiles.init(map);
    this.gridEngine.create(map, gridEngineConfig);
  }

  update() {}
}
