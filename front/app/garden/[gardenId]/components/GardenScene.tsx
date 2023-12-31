import { Scene } from "phaser";
// @ts-ignore
import AnimatedTiles from "phaser-animated-tiles-phaser3.5/dist/AnimatedTiles.min.js";
import { Character, Flower, Garden, Tree } from "@/app/types";

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
  private heartButton!: HTMLImageElement;
  private treeButton!: HTMLImageElement;
  private onTreeClick!: (tree: Tree) => void;
  private onFlowerClick!: (flower: Flower) => void;
  private onFlowerSelectOpenButtonClick!: () => void;
  private onTreeSelectOpenButtonClick!: () => void;
  private myTree!: Tree;
  private likeCheck!: boolean;
  private likeCount!: HTMLDivElement;
  private clickTime!: number;
  public trees!: Character[];
  public modalCheck!: boolean;
  public bgm!:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound;

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

    if (this.garden.mapType === 1) {
      this.bgm = this.sound.add("backgroundMusic1", {
        volume: 0.08,
        loop: true,
      });
    } else if (this.garden.mapType === 2) {
      this.bgm = this.sound.add("backgroundMusic2", {
        volume: 0.05,
        loop: true,
      });
    }
  }

  create() {
    let bgmCheck = false;
    if (
      //@ts-ignore
      this.sound.sounds.map((sound) => {
        if (sound.isPlaying) {
          bgmCheck = true;
        }
      })
    )
      if (!bgmCheck) {
        this.bgm!.play();
      }

    window.addEventListener("popstate", () => {
      this.bgm.stop();
    });

    this.modalCheck = false;
    const userToken = JSON.parse(sessionStorage.getItem("userInfo")!).state
      .userToken;
    const fetchTreeExistInfo = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/garden/tree/${this.garden.gardenId}`,

          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        const data = await res.json();
        return data;
      } catch (err) {
        console.log(err);
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

    const fetchLikeInfo = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/garden/like/check/${this.garden.gardenId}`,

          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        const data = await res.json();
        return data;
      } catch (err) {
        console.log(err);
      }
    };

    const getLikeInfo = async () => {
      const data = await fetchLikeInfo();
      if (data.result) {
        this.likeCheck = true;
        // this.heartButton = document.createElement("img");
        this.heartButton.src = "/assets/images/heart_fill.svg";
      } else {
        this.likeCheck = false;
        // this.heartButton = document.createElement("img");
        this.heartButton.src = "/assets/images/heart_empty.svg";
      }
    };

    getLikeInfo();

    const onHearthButtonClick = async () => {
      if (this.likeCheck) {
        //좋아요 취소하기
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/garden/like/${this.garden.gardenId}`,

            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          );
          const data = await res.json();
          if (data.httpStatus === "success") {
            this.heartButton.src = "/assets/images/heart_empty.svg";
            this.likeCheck = false;
            this.likeCount.textContent = (
              parseInt(this.likeCount.textContent!) - 1
            ).toString();
          }
          return data;
        } catch (err) {
          console.log(err);
        }
      } else {
        //좋아요 누르기
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/garden/like/${this.garden.gardenId}`,

            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          );
          const data = await res.json();
          if (data.httpStatus === "success") {
            this.heartButton.src = "/assets/images/heart_fill.svg";
            this.likeCheck = true;
            this.likeCount.textContent = (
              parseInt(this.likeCount.textContent!) + 1
            ).toString();
          }
          return data;
        } catch (err) {
          console.log(err);
        }
      }
    };

    //맵 생성. 레이어별로 foreach 돌면서.///////////////////////////////////////////////
    const map = this.make.tilemap({ key: "mainMap" });
    map.addTilesetImage("tileset", "tileset");
    map.addTilesetImage("tileset_basic_terrain", "tileset_basic_terrain");
    map.layers.forEach((layer, index) => {
      map.createLayer(index, ["tileset", "tileset_basic_terrain"], 0, 0);
    });

    //나무sprite 목록 생성./////////////////////////////////////////////////////////
    this.trees = [];
    this.garden.treePos?.forEach((tree) => {
      const initialSprite = this.physics.add
        .sprite(0, 0, tree.name)
        .setDepth(3)
        .setScale(0.25)
        .setInteractive()
        //열매 작성 폼 띄워줄거임.
        .on("pointerdown", () => {
          this.clickTime = this.time.now;
        })
        .on("pointerup", () => {
          if (
            !this.modalCheck &&
            this.garden.state === "ACCEPT" &&
            this.time.now - this.clickTime < 150
          ) {
            this.onTreeClick(tree);
            this.modalCheck = true;
          }
        });

      //열매 달아주기
      const fruitArr = ["apple", "cherry", "grape", "lemon", "orange", "peach"];
      const ornamentArr = [
        "blue",
        "gold",
        "goldStar",
        "green",
        "pink",
        "red",
        "silver",
        "silverStar",
        "yellow",
        "lease",
      ];
      const selectedFruit = [];

      if (this.garden.mapType === 1) {
        if (tree.fruitCnt! > 0) {
          for (let i = 0; i < tree.fruitCnt!; i += 5) {
            let tmpFruit =
              fruitArr[Math.floor(Math.random() * fruitArr.length)];
            selectedFruit.push(tmpFruit);

            if (i === 0) {
              this.add
                .image(tree.x! * 16 + 10, tree.y! * 16 + 4, tmpFruit)
                .setScale(0.15)
                .setOrigin(0, 0)
                .setDepth(7);
            } else if (i === 5) {
              this.add
                .image(tree.x! * 16 + 17, tree.y! * 16 + 5, tmpFruit)
                .setScale(0.15)
                .setOrigin(0, 0)
                .setDepth(7);
            } else if (i === 10) {
              this.add
                .image(tree.x! * 16 + 6, tree.y! * 16 + 12, tmpFruit)
                .setScale(0.15)
                .setOrigin(0, 0)
                .setDepth(7);
            } else if (i === 15) {
              this.add
                .image(tree.x! * 16 + 13, tree.y! * 16 + 11, tmpFruit)
                .setScale(0.15)
                .setOrigin(0, 0)
                .setDepth(7);
            } else if (i === 20) {
              this.add
                .image(tree.x! * 16 + 23, tree.y! * 16 + 13, tmpFruit)
                .setScale(0.15)
                .setOrigin(0, 0)
                .setDepth(7);
            }
          }
        }
      } else if (this.garden.mapType === 2) {
        if (tree.fruitCnt! > 0) {
          for (let i = 0; i < tree.fruitCnt!; i += 5) {
            let tmpOrnament =
              ornamentArr[Math.floor(Math.random() * ornamentArr.length)];
            selectedFruit.push(tmpOrnament);

            if (i === 0) {
              this.add
                .image(tree.x! * 16 + 10, tree.y! * 16 + 4, tmpOrnament)
                .setScale(0.15)
                .setOrigin(0, 0)
                .setDepth(7);
            } else if (i === 5) {
              this.add
                .image(tree.x! * 16 + 17, tree.y! * 16 + 5, tmpOrnament)
                .setScale(0.15)
                .setOrigin(0, 0)
                .setDepth(7);
            } else if (i === 10) {
              this.add
                .image(tree.x! * 16 + 6, tree.y! * 16 + 12, tmpOrnament)
                .setScale(0.15)
                .setOrigin(0, 0)
                .setDepth(7);
            } else if (i === 15) {
              this.add
                .image(tree.x! * 16 + 13, tree.y! * 16 + 11, tmpOrnament)
                .setScale(0.15)
                .setOrigin(0, 0)
                .setDepth(7);
            } else if (i === 20) {
              this.add
                .image(tree.x! * 16 + 23, tree.y! * 16 + 13, tmpOrnament)
                .setScale(0.15)
                .setOrigin(0, 0)
                .setDepth(7);
            }
          }
        }
      }

      this.trees.push({
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
          .on("pointerdown", () => {
            this.clickTime = this.time.now;
          })
          .on("pointerup", () => {
            if (
              !this.modalCheck &&
              this.garden.state === "ACCEPT" &&
              this.time.now - this.clickTime < 150
            ) {
              this.onFlowerClick(flower);
              this.modalCheck = true;
            }
          }),
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
      this.cameras.main.setZoom(window.innerHeight / 320);
    } else {
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
      "text-black font-bitBit flex-col justify-center items-center border-[15px] ";
    titleBox.addEventListener("click", () => {
      this.scene.restart();
    });
    let titleText = document.createElement("div");
    titleText.className =
      "flex flex-col bg-white w-full font-bitBit text-[16px] text-center pr-1";
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

    if (window.innerHeight >= window.innerWidth) {
      this.title.setPosition(
        window.innerWidth / 2 - window.innerWidth / this.cameras.main.zoom / 2,
        window.innerHeight / 2 -
          window.innerHeight / 2 / this.cameras.main.zoom +
          20 / this.cameras.main.zoom
      );
    } else {
      this.title.setPosition(
        window.innerWidth / 2 - window.innerWidth / this.cameras.main.zoom / 2,
        window.innerHeight / 2 -
          window.innerHeight / 2 / this.cameras.main.zoom +
          20 / this.cameras.main.zoom
      );
    }

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
    treeRegistTextBox.addEventListener("click", (e) => {
      this.modalCheck = true;
      e.stopPropagation();
      onPlusButtonClick();
      this.onTreeSelectOpenButtonClick();
    });

    const flowerPlantTextBox = document.createElement("div");
    flowerPlantTextBox.className =
      "flex flex-col bg-white px-3 py-2 w-full font-bitBit text-[18px] text-center";
    const flowerRegistText = document.createTextNode("꽃 심기");
    flowerPlantTextBox.appendChild(flowerRegistText);
    flowerPlantTextBox.addEventListener("click", (e) => {
      e.stopPropagation();
      onPlusButtonClick();
      this.onFlowerSelectOpenButtonClick();
      this.modalCheck = true;
    });

    //에셋(나무, 꽃) 수정 텍스트 생성, 이벤트 등록
    const treeModifyTextBox = document.createElement("div");
    treeModifyTextBox.className =
      "flex flex-col bg-white px-3 py-2 w-full font-bitBit text-[18px] text-center";
    const treeModifyText = document.createTextNode("나무 이동");
    treeModifyTextBox.appendChild(treeModifyText);
    treeModifyTextBox.addEventListener("click", (e) => {
      e.stopPropagation();
      onPlusButtonClick();
      this.scene.stop("gardenScene");
      this.scene.start("treeEditScene", { modifyTreeId: this.myTree.name });
      this.modalCheck = true;
    });

    //심겨져있는 나무 확인 목록 생성. 이벤트 등록
    if (this.trees.length > 0) {
      this.trees.forEach((tree) => {
        let tmpTextBox = document.createElement("div");
        tmpTextBox.className =
          "flex flex-col bg-white px-3 py-2 w-full font-bitBit text-[18px] text-center";
        tmpTextBox.appendChild(document.createTextNode(tree.id));
        tmpTextBox.addEventListener("click", () => {
          this.modalCheck = false;
          treeModalBox.style.display = "none";
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
    } else {
      this.footer.setPosition(
        window.innerWidth / 2 - window.innerWidth / this.cameras.main.zoom / 2,
        window.innerHeight / 2 +
          window.innerHeight / 2 / this.cameras.main.zoom -
          20
      );
    }

    this.footer.setClassName("!flex justify-between px-5");
    const registMenuSet = document.createElement("div");
    registMenuSet.className =
      "flex flex-col-reverse items-end gap-2 h-[40px] w-[40px]";

    const heartMenuSet = document.createElement("div");
    heartMenuSet.className = "flex gap-2 h-[40px] w-fit items-center";

    this.heartButton = document.createElement("img");
    this.heartButton.className = "w-full h-full";
    this.heartButton.addEventListener("click", (e) => {
      e.stopPropagation();
      onHearthButtonClick();
    });

    this.likeCount = document.createElement("div");
    this.likeCount.className = "font-bitbit text-lg";
    this.likeCount.textContent = this.garden.likes!.toString();

    heartMenuSet.appendChild(this.heartButton);
    heartMenuSet.appendChild(this.likeCount);

    this.plusButton = document.createElement("img");
    this.plusButton.src = "/assets/images/plus.svg";
    this.plusButton.className = "w-[40px] h-[40px]";
    // registMenuSet.appendChild(this.plusButton);
    registMenuSet.appendChild(this.plusButton);

    this.footer.node.appendChild(heartMenuSet);
    registMenuSet.appendChild(registModalBox);
    const onPlusButtonClick = () => {
      if (registModalBox.style.display === "flex") {
        this.modalCheck = false;
        registModalBox.style.display = "none";
      } else {
        this.modalCheck = true;
        registModalBox.style.display = "flex";
        treeModalBox.style.display = "none";
      }
    };

    const onTreeButtonClick = () => {
      if (treeModalBox.style.display === "flex") {
        this.modalCheck = false;
        treeModalBox.style.display = "none";
      } else {
        this.modalCheck = true;
        treeModalBox.style.display = "flex";
        registModalBox.style.display = "none";
      }
    };

    this.plusButton.addEventListener("click", (e) => {
      e.stopPropagation();
      onPlusButtonClick();
    });

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
    rightsideMenu.appendChild(treeMenuSet);
    rightsideMenu.appendChild(registMenuSet);
    this.footer.node.appendChild(rightsideMenu);

    this.treeButton.addEventListener("click", (e) => {
      e.stopPropagation();
      onTreeButtonClick();
    });

    if (this.garden.state !== "ACCEPT") {
      this.plusButton.style.display = "none";
      this.treeButton.style.display = "none";
    }

    //그리드엔진 설정///////////////////////////////////////////////////
    const gridEngineConfig = {
      snapToCell: true,
      characters: this.trees.concat(flowers),
    };
    // @ts-ignore
    this.sys.animatedTiles.init(map); //타일 애니메이션 실행.
    this.gridEngine.create(map, gridEngineConfig);
  }

  update() {}
}
