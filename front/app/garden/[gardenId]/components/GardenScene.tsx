import { Scene } from "phaser";
// @ts-ignore
import AnimatedTiles from "phaser-animated-tiles-phaser3.5/dist/AnimatedTiles.min.js";
import { tree } from "@/app/dummies";
import { Character } from "@/app/types";

export default class GardenScene extends Scene {
  private gridEngine!: any;
  private startX!: number;
  private startY!: number;
  private footer!: Phaser.GameObjects.DOMElement;
  private plusButton!: HTMLImageElement;
  private treeButton!: HTMLImageElement;
  private flowerButton!: HTMLImageElement;
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
    this.load.html("menu", "app/garden/[gardenId]/Menu.tsx");
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

    // // 맵 screen 사이즈에 맞춰서 zoom수치 설정. 너비/높이 중 더 큰 사이즈에 맞춰서.
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
    // this.plusButton.setPosition(200 / this.cameras.main.zoom, 50);
    //맨처음 시작 위치 기준으로 이동 제한하기 위해서 저장
    const startX = this.cameras.main.scrollX;
    const startY = this.cameras.main.scrollY;
    console.log("카메라 시작위치" + startX + " " + startY);
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      // 마우스 클릭 또는 터치 시작 시의 위치를 저장
      this.startX = pointer.x;
      this.startY = pointer.y;
    });

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) {
        // 마우스 드래그 또는 터치 스와이프 시 스크롤 위치 조정
        const dx = (this.startX - pointer.x) / this.cameras.main.zoom;
        const dy = (this.startY - pointer.y) / this.cameras.main.zoom;
        if (
          this.cameras.main.scrollX + dx >=
            startX - 240 + window.innerWidth / (2 * this.cameras.main.zoom) &&
          this.cameras.main.scrollX + dx <=
            startX + 240 - window.innerWidth / (2 * this.cameras.main.zoom)
        ) {
          this.cameras.main.scrollX += dx;
        }

        if (
          this.cameras.main.scrollY + dy <=
            startY + 160 - window.innerHeight / (2 * this.cameras.main.zoom) &&
          this.cameras.main.scrollY + dy >=
            startY - 160 + window.innerHeight / (2 * this.cameras.main.zoom)
        ) {
          this.cameras.main.scrollY += dy;
        }

        // 다음 스크롤를 위해 시작 위치 업데이트
        this.startX = pointer.x;
        this.startY = pointer.y;
        // console.log(
        //   this.cameras.main.scrollX + " " + this.cameras.main.scrollY
        // );
      }
    });

    //버튼, 모달 생성./////////////////////////////////////////////////////////

    // this.plusButton = this.add
    //   .image(
    //     250 - (window.innerWidth / 2 - 10) / this.cameras.main.zoom,
    //     170 + (window.innerHeight / 2 - 80) / this.cameras.main.zoom,
    //     "plusButton"
    //   )
    //   .setDepth(3)
    //   .setScale(
    //     5 / (16 * this.cameras.main.zoom),
    //     5 / (16 * this.cameras.main.zoom)
    //   );

    // const textBox = this.add.image(0, 0, "pixelBox").setDisplaySize(50, 50);

    //DOM 요소 추가가 가능하다?!!??!? ///////////////////////////////////////////

    const modalStyle = {
      // "background-color": "white",
      borderImage: `url("/assets/images/pixelBorder.png") 25`,
      width: "250px",
      height: "fit-content",
    };

    const modalBox = this.add
      .dom(300, 200, "div", modalStyle)
      .setDepth(3)
      .setScale(0.25, 0.25);

    modalBox.setClassName(
      "text-black font-bitBit flex justify-center items-center border-[15px]"
    );

    const textBox1 = document.createElement("div");
    textBox1.className =
      "flex flex-col bg-white px-3 py-2 min-w-max font-bitBit text-[32px] text-center";
    const treeRegistText = document.createTextNode("나무 심기");
    textBox1.appendChild(treeRegistText);

    const textBox2 = document.createElement("div");
    textBox2.className =
      "flex flex-col bg-white px-3 py-2 min-w-max font-bitBit text-[32px] text-center";
    const flowerRegistText = document.createTextNode("꽃 심기");
    textBox2.appendChild(flowerRegistText);

    modalBox.node.appendChild(textBox1);
    modalBox.node.appendChild(textBox2);

    const footerStyle = {
      // position: "absolute",
      // bottom: "0px",
      // left: `${1.5 * window.innerWidth + 20}px`,
      display: "flex",
      "justify-content": "space-between",
      width: `${window.innerWidth}px`,
      // "background-color": "white",
    };
    // this.cameras.main.setZoom(2.3);

    this.footer = this.add
      .dom(0, 0, "div", footerStyle)
      .setOrigin(0, 0)
      .setDepth(3)
      .setScale(1 / this.cameras.main.zoom);

    if (window.innerHeight >= window.innerWidth) {
      this.footer.setPosition(
        240 - window.innerWidth / this.cameras.main.zoom / 2,
        320 - 60 / this.cameras.main.zoom
      );
      console.log(this.footer.x + " " + this.footer.y);
    } else {
      this.footer.setPosition(
        0,
        130 + window.innerHeight / this.cameras.main.zoom / 2
      );
      console.log(this.footer.x + " " + this.footer.y);
    }

    console.log(this.footer.x + " " + this.footer.y);
    this.footer.setClassName("!flex justify-between px-5");
    const registMenuSet = document.createElement("div");
    registMenuSet.className = "flex flex-col-reverse gap-2 h-[40px] w-[40px]";

    this.plusButton = document.createElement("img");
    this.plusButton.src = "/assets/images/plus.svg";
    this.plusButton.className = "w-full h-full";
    registMenuSet.appendChild(this.plusButton);
    this.footer.node.appendChild(registMenuSet);

    // registMenuSet.appendChild(modalBox);

    const treeMenuSet = document.createElement("div");
    treeMenuSet.className = "flex flex-col-reverse gap-2 h-[40px] w-[40px]";
    this.treeButton = document.createElement("img");
    this.treeButton.src = "/assets/images/tree.svg";
    this.treeButton.className = "w-full h-full";
    treeMenuSet.appendChild(this.treeButton);

    const flowerMenuSet = document.createElement("div");
    flowerMenuSet.className = "flex flex-col-reverse gap-2 h-[40px] w-[40px]";
    this.flowerButton = document.createElement("img");
    this.flowerButton.src = "/assets/images/flower.png";
    this.flowerButton.className = "w-full h-full";
    flowerMenuSet.appendChild(this.flowerButton);

    const rightsideMenu = document.createElement("div");
    rightsideMenu.className = "flex gap-5";
    rightsideMenu.appendChild(flowerMenuSet);
    rightsideMenu.appendChild(treeMenuSet);
    this.footer.node.appendChild(rightsideMenu);
    // const registModal = this.add.container(
    //   250 - (window.innerWidth / 2 - 60) / this.cameras.main.zoom,
    //   170 + (window.innerHeight / 2 - 180) / this.cameras.main.zoom
    // );
    // registModal.setDepth(3).setVisible(false);

    // this.plusButton.setInteractive();
    // this.plusButton.on("pointerdown", () => {
    //   registModal.setVisible(!registModal.visible);
    // });

    // this.treeButton = this.add
    //   .image(
    //     250 + (window.innerWidth / 2 - 70) / this.cameras.main.zoom,
    //     170 + (window.innerHeight / 2 - 80) / this.cameras.main.zoom,
    //     "treeButton"
    //   )
    //   .setDepth(3)
    //   .setScale(
    //     5 / (16 * this.cameras.main.zoom),
    //     5 / (16 * this.cameras.main.zoom)
    //   );

    // this.treeButton.setInteractive();
    // this.treeButton.on("pointerdown", () => {
    //   console.log("여깃어요!");
    // });

    // this.flowerButton = this.add
    //   .image(
    //     250 + (window.innerWidth / 2 - 130) / this.cameras.main.zoom,
    //     170 + (window.innerHeight / 2 - 80) / this.cameras.main.zoom,
    //     "flowerButton"
    //   )
    //   .setDepth(3)
    //   .setScale(
    //     5 / (16 * this.cameras.main.zoom),
    //     5 / (16 * this.cameras.main.zoom)
    //   );

    // this.flowerButton.setInteractive();
    // this.flowerButton.on("pointerdown", () => {
    //   console.log("여깃어요!");
    // });

    //드롭다운 추가/////////////////////////////////////////////////////

    // .setScale(
    //   5 / (16 * this.cameras.main.zoom),
    //   5 / (16 * this.cameras.main.zoom)
    // );

    //그리드엔진 설정///////////////////////////////////////////////////
    const gridEngineConfig = {
      snapToCell: true,
      characters: characters,
    };

    //타일 애니메이션 실행.
    // @ts-ignore
    this.sys.animatedTiles.init(map);
    this.gridEngine.create(map, gridEngineConfig);
  }

  update() {
    //ui 버튼 뷰포트에 고정
    // this.footer.setPosition(
    //   250 -
    //     (window.innerWidth / 2 - 10) / this.cameras.main.zoom -
    //     (240 - (240 * window.innerWidth) / 480) +
    //     this.cameras.main.scrollX,
    //   // 300
    //   170 +
    //     (window.innerHeight / 2 - 80) / this.cameras.main.zoom -
    //     (160 - (160 * window.innerHeight) / 320) +
    //     this.cameras.main.scrollY
    // );
    // this.plusButton.setPosition(
    //   250 -
    //     (window.innerWidth / 2 - 10) / this.cameras.main.zoom -
    //     (240 - (240 * window.innerWidth) / 480) +
    //     this.cameras.main.scrollX,
    //   // 300
    //   170 +
    //     (window.innerHeight / 2 - 80) / this.cameras.main.zoom -
    //     (160 - (160 * window.innerHeight) / 320) +
    //     this.cameras.main.scrollY
    // );
    // this.treeButton.setPosition(
    //   250 +
    //     (window.innerWidth / 2 - 70) / this.cameras.main.zoom -
    //     (240 - (240 * window.innerWidth) / 480) +
    //     this.cameras.main.scrollX,
    //   // 300
    //   170 +
    //     (window.innerHeight / 2 - 80) / this.cameras.main.zoom -
    //     (160 - (160 * window.innerHeight) / 320) +
    //     this.cameras.main.scrollY
    // );
    // this.flowerButton.setPosition(
    //   250 +
    //     (window.innerWidth / 2 - 130) / this.cameras.main.zoom -
    //     (240 - (240 * window.innerWidth) / 480) +
    //     this.cameras.main.scrollX,
    //   // 300
    //   170 +
    //     (window.innerHeight / 2 - 80) / this.cameras.main.zoom -
    //     (160 - (160 * window.innerHeight) / 320) +
    //     this.cameras.main.scrollY
    // );
  }
}
