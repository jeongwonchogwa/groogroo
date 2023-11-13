import { Scene } from "phaser";
// @ts-ignore
import AnimatedTiles from "phaser-animated-tiles-phaser3.5/dist/AnimatedTiles.min.js";
import { treeList } from "@/app/dummies";
import { Character, Flower, Garden, Tree } from "@/app/types";
import ReactDOM from "react-dom/client";

interface Props {
  onTreeClick: (tree: Tree) => void;
  onFlowerClick: (flower: Flower) => void;
  onFlowerSelectOpenButtonClick: () => void;
  onTreeSelectOpenButtonClick: () => void;
}

export default class GardenScene extends Scene {
  private gridEngine!: any;
  private garden!: Garden;
  private startX!: number;
  private startY!: number;
  private title!: Phaser.GameObjects.DOMElement;
  private footer!: Phaser.GameObjects.DOMElement;
  private plusButton!: HTMLImageElement;
  private treeButton!: HTMLImageElement;
  private onTreeClick!: (tree: Tree) => void;
  private onFlowerClick!: (flower: Flower) => void;
  private onFlowerSelectOpenButtonClick!: () => void;
  private onTreeSelectOpenButtonClick!: () => void;
  private myTree!: Tree;

  constructor(props: Props) {
    super("gardenScene");
    this.onTreeClick = props.onTreeClick;
    this.onFlowerClick = props.onFlowerClick;
    this.onFlowerSelectOpenButtonClick = props.onFlowerSelectOpenButtonClick;
    this.onTreeSelectOpenButtonClick = props.onTreeSelectOpenButtonClick;
  }

  init(data: { garden: Garden }) {
    this.garden = data.garden;
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
    const AccessToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
    const fetchTreeExistInfo = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/garden/tree/${this.garden.gardenId}`,

          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${AccessToken}`,
            },
          }
        );
        const data = await res.json();
        console.log(data);
        return data;
      } catch (error) {
        console.log(error);
      }
    };

    const getTreeExistInfo = async () => {
      const data = await fetchTreeExistInfo();
      if (data.treeGardenId != null) {
        registModalBox.appendChild(treeModifyTextBox);
        this.garden.treePos?.forEach((tree) => {
          if (tree.id === data.treeGardenId) {
            this.myTree = tree;
          }
        });
      } else {
        registModalBox.appendChild(treeRegistTextBox);
      }

      registModalBox.appendChild(flowerPlantTextBox);
    };

    getTreeExistInfo();

    //맵 생성. 레이어별로 foreach 돌면서.///////////////////////////////////////////////
    const map = this.make.tilemap({ key: "mainMap" });
    map.addTilesetImage("tileset", "tileset");
    map.layers.forEach((layer, index) => {
      map.createLayer(index, "tileset", 0, 0);
    });

    //나무sprite 목록 생성./////////////////////////////////////////////////////////
    const trees: Character[] = [];
    this.garden.treePos?.forEach((tree) => {
      const initialSprite = this.physics.add
        .sprite(0, 0, tree.name)
        .setDepth(3)
        .setScale(0.25)
        .setInteractive()
        //열매 작성 폼 띄워줄거임.
        .on("pointerup", () => this.onTreeClick(tree));

      //열매 달아주기////////////////////////////////////
      const fruitArr = ["apple", "cherry", "grape", "lemon", "orange", "peach"];
      const selectedFruit = [];

      if (tree.fruitCnt! > 0) {
        for (let i = 0; i < tree.fruitCnt!; i++) {
          let tmpFruit = fruitArr[Math.floor(Math.random() * fruitArr.length)];
          selectedFruit.push(tmpFruit);

          if (i === 0) {
            this.add
              .image(tree.x! * 16 + 12, tree.y! * 16 + 2, tmpFruit)
              .setScale(0.2)
              .setOrigin(0, 0)
              .setDepth(3);
          } else if (i === 1) {
            this.add
              .image(tree.x! * 16 + 2, tree.y! * 16 + 8, tmpFruit)
              .setScale(0.2)
              .setOrigin(0, 0)
              .setDepth(3);
          } else if (i === 2) {
            this.add
              .image(tree.x! * 16 + 12, tree.y! * 16 + 12, tmpFruit)
              .setScale(0.2)
              .setOrigin(0, 0)
              .setDepth(3);
          } else {
            this.add
              .image(tree.x! * 16 + 22, tree.y! * 16 + 8, tmpFruit)
              .setScale(0.2)
              .setOrigin(0, 0)
              .setDepth(3);
          }
        }
      }

      trees.push({
        id: tree.name,
        sprite: initialSprite,
        startPosition: { x: tree.x!, y: tree.y! },
        tileHeight: 2,
        tileWidth: 2,
        offsetX: 8,
        offsetY: 16,
      });
    });

    //꽃sprite 목록 생성.///////////////////////////////////////////////////////////
    const flowers: Character[] = [];
    this.garden.flowerPos?.forEach((flower) => {
      flowers.push({
        id: "flower" + flower.id,
        sprite: this.physics.add
          .sprite(0, 0, "flower" + flower.id)
          .setDepth(3)
          .setScale(0.25)
          .setOrigin(0, 0)
          .setInteractive()
          //메세지 띄워주자
          .on("pointerup", () => this.onFlowerClick(flower)),
        startPosition: { x: flower.x!, y: flower.y! },
        tileHeight: 1,
        tileWidth: 1,
        offsetX: 0,
        offsetY: 0,
      });
    });

    //camera 설정 /////////////////////////////////////////////////////////////////
    //zoom, scroll, position 설정.
    this.cameras.main.setBackgroundColor("#1E7CB8");

    // 맵 screen 사이즈에 맞춰서 zoom수치 설정. 너비/높이 중 더 큰 사이즈에 맞춰서.
    if (window.innerHeight >= window.innerWidth) {
      // console.log(
      //   "높이가 너비보다 같거나 더큼" + window.innerHeight / 320 + "배"
      // );
      this.cameras.main.setZoom(window.innerHeight / 320);
    } else {
      // console.log("너비가 높이보다 더 큼" + window.innerWidth / 480 + "배");
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
    // 마우스 클릭 또는 터치 시작 시의 위치를 저장
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.startX = pointer.x;
      this.startY = pointer.y;
    });
    // 마우스 드래그 또는 터치 스와이프 시 스크롤 위치 조정
    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) {
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

    //정원 타이틀 박스 생성, CSS 설정
    const titleStyle = {
      width: window.innerWidth + "px",
      height: "fit-content",
    };

    const titleBox = document.createElement("div");
    titleBox.style.borderImage = `url("/assets/images/pixelBorder.png") 25`;
    titleBox.style.width = "fit-content";
    titleBox.style.height = "fit-content";
    titleBox.className =
      "text-black font-bitBit flex-col justify-center items-center border-[15px]";

    let titleText = document.createElement("div");
    titleText.className =
      "flex flex-col bg-white w-full font-bitBit text-[24px] text-center px-5";
    titleText.appendChild(document.createTextNode(this.garden.name));

    titleBox.appendChild(titleText);

    this.title = this.add
      .dom(0, 0, "div", titleStyle)
      .setOrigin(0, 0)
      .setDepth(3)
      .setScale(1 / this.cameras.main.zoom)
      .setScrollFactor(0, 0);
    this.title.node.appendChild(titleBox);
    this.title.setClassName("!flex justify-center");
    this.title.setPosition(
      window.innerWidth / 2 - 220 / this.cameras.main.zoom,
      window.innerHeight / 2 - 440 / this.cameras.main.zoom
    );

    //에셋추가 모달 박스 생성, CSS 설정
    const registModalBox = document.createElement("div");
    registModalBox.style.borderImage = `url("/assets/images/pixelBorder.png") 25`;
    registModalBox.style.width = "160px";
    registModalBox.style.height = "fit-content";
    registModalBox.className =
      "text-black font-bitBit hidden flex-col justify-center items-center border-[15px]";

    //나무 목록 박스 생성, CSS 설정
    const treeModalBox = document.createElement("div");
    treeModalBox.style.borderImage = `url("/assets/images/pixelBorder.png") 25`;
    treeModalBox.style.width = "200px";
    treeModalBox.style.height = "fit-content";
    treeModalBox.className =
      "text-black font-bitBit hidden flex-col justify-center items-center border-[15px]";

    //에셋(나무, 꽃) 추가 텍스트 생성, 이벤트 등록
    const treeRegistTextBox = document.createElement("div");
    treeRegistTextBox.className =
      "flex flex-col bg-white px-3 py-2 w-full font-bitBit text-[18px] text-center";
    const treeRegistText = document.createTextNode("나무 심기");
    treeRegistTextBox.appendChild(treeRegistText);
    treeRegistTextBox.addEventListener("click", () => {
      onPlusButtonClick();
      this.onTreeSelectOpenButtonClick();
    });

    const flowerPlantTextBox = document.createElement("div");
    flowerPlantTextBox.className =
      "flex flex-col bg-white px-3 py-2 w-full font-bitBit text-[18px] text-center";
    const flowerRegistText = document.createTextNode("꽃 심기");
    flowerPlantTextBox.appendChild(flowerRegistText);
    flowerPlantTextBox.addEventListener("click", () => {
      onPlusButtonClick();
      this.onFlowerSelectOpenButtonClick();
    });

    //에셋(나무, 꽃) 수정 텍스트 생성, 이벤트 등록
    const treeModifyTextBox = document.createElement("div");
    treeModifyTextBox.className =
      "flex flex-col bg-white px-3 py-2 w-full font-bitBit text-[18px] text-center";
    const treeModifyText = document.createTextNode("나무 수정");
    treeModifyTextBox.appendChild(treeModifyText);
    treeModifyTextBox.addEventListener("click", () => {
      onPlusButtonClick();
      this.scene.stop("gardenScene");
      this.scene.start("treeEditScene", { modifyTreeId: this.myTree.name });
    });

    //심겨져있는 나무 목록 생성. 이벤트 등록
    if (trees.length > 0) {
      trees.forEach((tree) => {
        let tmpTextBox = document.createElement("div");
        tmpTextBox.className =
          "flex flex-col bg-white px-3 py-2 w-full font-bitBit text-[18px] text-center";
        tmpTextBox.appendChild(document.createTextNode(tree.id));
        tmpTextBox.addEventListener("click", () => {
          if (
            (window.innerWidth / 2 >
              (20 - tree.startPosition.x + 0.5) * 16 * this.cameras.main.zoom &&
              window.innerWidth / 2) ||
            window.innerWidth / 2 >
              tree.startPosition.x + 0.5 * 16 * this.cameras.main.zoom
          )
            this.cameras.main.setScroll(
              240 -
                (240 * window.innerWidth) / 480 +
                (tree.startPosition.x - 15) * 16,
              this.cameras.main.scrollY
            );

          const nameTagStyle = {
            borderImage: `url("/assets/images/pixelBorder.png") 25`,
            width: "160px",
            height: "fit-content",
          };
          const nameTagBox = this.add
            .dom(
              240 + (tree.startPosition.x - 15) * 16 - 4,
              160 + (tree.startPosition.y - 10) * 16 + 34,

              "div",
              nameTagStyle
            )
            .setScale(0.25, 0.25)
            .setOrigin(0, 0);

          nameTagBox.setClassName(
            "text-black font-bitBit hidden flex-col justify-center items-center border-[15px]"
          );

          const nameTextBox = document.createElement("div");
          nameTextBox.className =
            "flex flex-col bg-white px-3 w-full font-bitBit text-[16px] text-center";
          const nameText = document.createTextNode(tree.id);
          nameTextBox.appendChild(nameText);
          nameTagBox.node.appendChild(nameTextBox);
          // console.log(
          //   this.cameras.main.scrollX + " " + this.cameras.main.scrollY
          // );

          this.time.addEvent({
            delay: 4000,
            callback: function () {
              nameTagBox.destroy();
            },
            callbackScope: this,
            loop: false,
          });
        });
        treeModalBox.appendChild(tmpTextBox);
      });
    } else {
      let tmpTextBox = document.createElement("div");
      tmpTextBox.className =
        "flex flex-col bg-white px-3 py-2 w-full font-bitBit text-[18px] text-center";
      tmpTextBox.appendChild(document.createTextNode("나무가 없습니다"));
      treeModalBox.appendChild(tmpTextBox);
    }

    const footerStyle = {
      display: "flex",
      "justify-content": "space-between",
      width: `${window.innerWidth}px`,
    };

    this.footer = this.add
      .dom(0, 0, "div", footerStyle)
      .setOrigin(0, 0)
      .setDepth(3)
      .setScale(1 / this.cameras.main.zoom)
      .setScrollFactor(0, 0);

    if (window.innerHeight >= window.innerWidth) {
      this.footer.setPosition(
        window.innerWidth / 2 - window.innerWidth / this.cameras.main.zoom / 2,
        window.innerHeight / 2 + 160 - 60 / this.cameras.main.zoom
      );
      // console.log(this.footer.x + " " + this.footer.y);
    } else {
      this.footer.setPosition(
        0,
        160 -
          60 / this.cameras.main.zoom +
          window.innerHeight / this.cameras.main.zoom / 2
      );
      // console.log(this.footer.x + " " + this.footer.y);
    }

    // console.log(this.footer.x + " " + this.footer.y);
    this.footer.setClassName("!flex justify-between px-5");
    const registMenuSet = document.createElement("div");
    registMenuSet.className = "flex flex-col-reverse gap-2 h-[40px] w-[40px]";

    this.plusButton = document.createElement("img");
    this.plusButton.src = "/assets/images/plus.svg";
    this.plusButton.className = "w-full h-full";
    registMenuSet.appendChild(this.plusButton);
    this.footer.node.appendChild(registMenuSet);
    registMenuSet.appendChild(registModalBox);
    const onPlusButtonClick = () => {
      if (registModalBox.style.display === "flex") {
        registModalBox.style.display = "none";
      } else {
        registModalBox.style.display = "flex";
        treeModalBox.style.display = "none";
        // flowerModalBox.style.display = "none";
      }
    };

    const onTreeButtonClick = () => {
      if (treeModalBox.style.display === "flex") {
        treeModalBox.style.display = "none";
      } else {
        treeModalBox.style.display = "flex";
        registModalBox.style.display = "none";
        // flowerModalBox.style.display = "none";
      }
    };

    this.plusButton.addEventListener("click", onPlusButtonClick);

    const treeMenuSet = document.createElement("div");
    treeMenuSet.className =
      "flex flex-col-reverse gap-2 h-[40px] w-[40px] items-end";
    this.treeButton = document.createElement("img");
    this.treeButton.src = "/assets/images/tree.svg";
    this.treeButton.className = "w-full h-full";
    treeMenuSet.appendChild(this.treeButton);
    treeMenuSet.appendChild(treeModalBox);

    const rightsideMenu = document.createElement("div");
    rightsideMenu.className = "flex gap-5";
    // rightsideMenu.appendChild(flowerMenuSet);
    rightsideMenu.appendChild(treeMenuSet);
    this.footer.node.appendChild(rightsideMenu);

    this.treeButton.addEventListener("click", onTreeButtonClick);
    // this.flowerButton.addEventListener("click", onFlowerButtonClick);

    if (this.garden.state !== "ACCEPT") {
      // this.plusButton.style.display = "none";
      // this.flowerButton.style.display = "none";
      // this.treeButton.style.display = "none";
    }

    //그리드엔진 설정///////////////////////////////////////////////////
    const gridEngineConfig = {
      snapToCell: true,
      characters: trees.concat(flowers),
    };
    // @ts-ignore
    this.sys.animatedTiles.init(map); //타일 애니메이션 실행.
    this.gridEngine.create(map, gridEngineConfig);
  }

  update() {
    //ui 버튼 뷰포트에 고정
    // if (window.innerHeight >= window.innerWidth) {
    //   this.footer.setPosition(
    //     240 -
    //       window.innerWidth / this.cameras.main.zoom / 2 -
    //       (240 - (240 * window.innerWidth) / 480) +
    //       this.cameras.main.scrollX,
    //     320 -
    //       60 / this.cameras.main.zoom -
    //       (160 - (160 * window.innerHeight) / 320) +
    //       this.cameras.main.scrollY
    //   );
    // } else {
    //   this.footer.setPosition(
    //     -(240 - window.innerWidth / 2) + this.cameras.main.scrollX,
    //     160 -
    //       60 / this.cameras.main.zoom +
    //       window.innerHeight / this.cameras.main.zoom / 2 -
    //       (160 - window.innerHeight / 2) +
    //       this.cameras.main.scrollY
    //   );
    // }
  }
}
