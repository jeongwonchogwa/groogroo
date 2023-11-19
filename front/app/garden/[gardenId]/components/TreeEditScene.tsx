import { Character, Garden, Tree } from "@/app/types";
import { Scene } from "phaser";
// @ts-ignore
import AnimatedTiles from "phaser-animated-tiles-phaser3.5/dist/AnimatedTiles.min.js";
import Button from "@/app/components/Button";
import ReactDOM from "react-dom/client";
import { userInfoStore } from "@/stores/userInfoStore";

interface Props {
  garden: Garden;
  onTreeSelectOpenButtonClick: (type?: string) => void;
}

export default class TreeEditScene extends Scene {
  private gridEngine!: any;
  private assetSprite!: Phaser.Physics.Arcade.Sprite;
  private moveCheck!: boolean;
  private errorSpriteBox!: Phaser.GameObjects.Graphics;
  private defaultSpriteBox!: Phaser.GameObjects.Graphics;
  private registButtonBox!: Phaser.GameObjects.DOMElement;
  private keyBox!: Phaser.GameObjects.DOMElement;
  private leftKey!: HTMLButtonElement;
  private rightKey!: HTMLButtonElement;
  private upKey!: HTMLButtonElement;
  private downKey!: HTMLButtonElement;
  private selectedTreeUrl!: string;
  private modifyTreeId!: string;
  private modifyTreeGardenId?: number;
  private garden: Garden;
  private selectedTreeHandle!: string;
  private currentTime!: string;
  private onTreeSelectOpenButtonClick: (type?: string) => void;
  private changeCheck!: boolean;
  public changeTree!: (modifyTreeUrl: string) => void;

  constructor(props: Props) {
    super("treeEditScene");
    this.garden = props.garden;
    this.onTreeSelectOpenButtonClick = props.onTreeSelectOpenButtonClick;
  }

  updateGarden(garden: Garden) {
    this.garden = garden;
    //@ts-ignore
    this.game.scene.getScene("flowerEditScene").garden = garden;
    //@ts-ignore
    this.game.scene.getScene("preloader").garden = garden;
  }

  init(data: { selectedTreeUrl: string; modifyTreeId: string }) {
    if (data.selectedTreeUrl) {
      this.selectedTreeUrl = data.selectedTreeUrl;
    } else {
      this.modifyTreeId = data.modifyTreeId;
    }
  }

  preload() {
    this.load.scenePlugin(
      "animatedTiles",
      AnimatedTiles,
      "animatedTiles",
      "animatedTiles"
    );

    this.currentTime = " " + new Date().getTime();

    this.load.spritesheet(
      "selectedTree" + this.currentTime,
      this.selectedTreeUrl + "?timestamp=" + new Date().getTime(),
      {
        frameWidth: 128,
        frameHeight: 128,
      }
    );
  }

  create() {
    // this.sound.stopAll();

    //맵 생성. 레이어별로 foreach 돌면서.///////////////////////////////////////////////
    const map = this.make.tilemap({ key: "mainMap" });
    map.addTilesetImage("tileset", "tileset");
    map.addTilesetImage("tileset_basic_terrain", "tileset_basic_terrain");
    map.layers.forEach((layer, index) => {
      map.createLayer(index, ["tileset", "tileset_basic_terrain"], 0, 0);
    });

    //나무sprite 목록 생성./////////////////////////////////////////////////////////
    const trees: Character[] = [];
    this.garden.treePos?.forEach((tree) => {
      trees.push({
        id: tree.name,
        sprite: this.physics.add
          .sprite(0, 0, tree.name)
          .setDepth(3)
          .setScale(0.25)
          .setOrigin(0, 0),
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
          .setOrigin(0, 0),
        startPosition: { x: flower.x!, y: flower.y! },
        tileHeight: 1,
        tileWidth: 1,
        offsetX: 0,
        offsetY: 0,
      });
    });

    //배치할 에셋 sprite 생성 (새 나무)

    if (this.selectedTreeUrl) {
      this.assetSprite = this.physics.add
        .sprite(0, 0, "selectedTree" + this.currentTime)
        .setScale(0.25)
        .setDepth(3)
        .setOrigin(0, 0)
        .setInteractive()
        .on("pointerup", () => {
          this.onTreeSelectOpenButtonClick("modify");
        });
      trees.push({
        id: "selectedTree",
        sprite: this.assetSprite,
        startPosition: { x: 15, y: 10 },
        tileHeight: 0,
        tileWidth: 0,
        offsetX: 8,
        offsetY: 16,
      });
      this.selectedTreeHandle = "selectedTree";

      //기존 나무 이동시 핸들 지정
    } else if (this.modifyTreeId) {
      this.garden.treePos?.forEach((tree) => {
        if (tree.name === this.modifyTreeId) this.modifyTreeGardenId = tree.id;
      });

      this.modifyTreeId = this.modifyTreeId;

      trees.forEach((tree) => {
        if (tree.id === this.modifyTreeId) {
          tree.tileHeight = 0;
          tree.tileWidth = 0;
          tree.sprite.setInteractive();
          tree.sprite.on("pointerup", () => {
            this.onTreeSelectOpenButtonClick("modify");
          });
          this.assetSprite = tree.sprite;
          this.selectedTreeHandle = tree.id;
        }
      });
    }

    this.cameras.main.setBackgroundColor("#1E7CB8");
    this.moveCheck = false;

    this.changeTree = (modifyTreeUrl: string) => {
      if (this.selectedTreeUrl) {
        this.load.image("modifyImage", modifyTreeUrl);
        this.load.on("filecomplete-image-modifyImage", () => {
          this.assetSprite.setTexture("modifyImage");
        });
      } else {
        this.load.image("modifyImage", modifyTreeUrl);
        this.load.on("filecomplete-image-modifyImage", () => {
          trees.forEach((tree) => {
            if (tree.id === this.modifyTreeId) {
              tree.sprite.setTexture("modifyImage");
            }
          });
        });
      }
    };

    //맵 screen 사이즈에 맞춰서 zoom수치 설정. 너비/높이 중 더 큰 사이즈에 맞춰서.
    if (window.innerHeight > window.innerWidth) {
      this.cameras.main.setZoom(window.innerHeight / 320);
    } else {
      this.cameras.main.setZoom(window.innerWidth / 480);
    }
    this.cameras.main.setPosition(0, 0);
    this.cameras.main.startFollow(this.assetSprite, true);
    this.cameras.main.setFollowOffset(0);
    this.cameras.main.setRoundPixels(true);

    //등록버튼 박스 스타일
    const registBottonBoxStyle = {
      width: `${window.innerWidth}px`,
    };

    //박스 PhaserDOM으로 생성
    this.registButtonBox = this.add
      .dom(0, 0, "div", registBottonBoxStyle)
      .setDepth(3)
      .setScale(1 / this.cameras.main.zoom)
      .setClassName("!flex justify-between px-5");

    //버튼 임포트해와서 DOM 요소로 렌더링하기.

    const onCancelButtonClick = () => {
      this.scene.stop("treeEditScene");
      this.scene.start("gardenScene");
    };

    //나무 등록 API요청////////////////////////////////////////////////////
    const userToken = JSON.parse(sessionStorage.getItem("userInfo")!).state
      .userToken;
    const onRegistButtonClick = async () => {
      if (this.defaultSpriteBox.visible) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/garden/tree`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                gardenId: this.garden.gardenId,
                imageUrl:
                  this.selectedTreeUrl + "?timestamp=" + new Date().getTime(),
                x: this.gridEngine.getPosition("selectedTree").x,
                y: this.gridEngine.getPosition("selectedTree").y,
                preset: true,
              }),
            }
          );
          const Data = await res.json();

          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/garden/${this.garden.gardenId}`,

              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              }
            );
            const gardenData = await res.json();
            //@ts-ignore
            this.game.scene.getScene("preloader").garden =
              gardenData.gardenInfo;
            //@ts-ignore
            this.game.scene.getScene("flowerEditScene").garden =
              gardenData.gardenInfo;
            //@ts-ignore
            this.game.scene.getScene("treeEditScene").garden =
              gardenData.gardenInfo;

            this.scene.stop("treeEditScene");
            this.scene.start("preloader");
          } catch (err) {
            console.log(err);
          }
        } catch (err) {
          console.log(err);
        }
      } else {
      }
    };

    const onModifyButtonClick = async () => {
      if (this.defaultSpriteBox.visible) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/garden/decoration`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                trees: [
                  {
                    id: this.modifyTreeGardenId,
                    x: this.gridEngine.getPosition(this.selectedTreeHandle).x,
                    y: this.gridEngine.getPosition(this.selectedTreeHandle).y,
                  },
                ],
                flowers: [],
              }),
            }
          );
          const Data = await res.json();

          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/garden/${this.garden.gardenId}`,

              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              }
            );
            const gardenData = await res.json();
            //@ts-ignore
            this.game.scene.getScene("preloader").garden =
              gardenData.gardenInfo;
            //@ts-ignore
            this.game.scene.getScene("flowerEditScene").garden =
              gardenData.gardenInfo;
            //@ts-ignore
            this.game.scene.getScene("treeEditScene").garden =
              gardenData.gardenInfo;
            this.scene.stop("treeEditScene");
            this.scene.start("preloader");
          } catch (err) {
            console.log(err);
          }
        } catch (err) {
          console.log(err);
        }
      } else {
      }
    };

    //수정, 등록 버튼 추가///////////////////////////////////////////////
    let cancelButton = Button({
      color: "default",
      label: "취소하기",
      onClick: onCancelButtonClick,
    });
    let registButton = Button({
      color: "secondary",
      label: "나무심기",
      onClick: onRegistButtonClick,
    });

    let modifyButton = Button({
      color: "secondary",
      label: "수정하기",
      onClick: onModifyButtonClick,
    });
    const DOMCancelButton = document.createElement("div");
    const DOMRegistButton = document.createElement("div");

    ReactDOM.createRoot(DOMCancelButton).render(cancelButton);
    if (this.selectedTreeUrl) {
      ReactDOM.createRoot(DOMRegistButton).render(registButton);
    } else {
      ReactDOM.createRoot(DOMRegistButton).render(modifyButton);
    }

    DOMCancelButton.style.width = window.innerWidth / 2 - 40 + "px";
    DOMCancelButton.style.height = "60px";

    DOMRegistButton.style.width = window.innerWidth / 2 - 40 + "px";
    DOMRegistButton.style.height = "60px";

    this.registButtonBox.node.appendChild(DOMCancelButton);
    this.registButtonBox.node.appendChild(DOMRegistButton);
    this.registButtonBox.setOrigin(0, 0).setScrollFactor(0, 0);

    if (window.innerHeight >= window.innerWidth) {
      this.registButtonBox.setPosition(
        window.innerWidth / 2 - window.innerWidth / this.cameras.main.zoom / 2,
        window.innerHeight / 2 - 160 + 80 / this.cameras.main.zoom
      );
    } else {
      this.registButtonBox.setPosition(
        window.innerWidth / 2 - window.innerWidth / this.cameras.main.zoom / 2,
        window.innerHeight / 2 - 160 + 80 / this.cameras.main.zoom
      );
    }

    //상하좌우 이동 버튼 추가/////////////////////////////////////////////
    const leftButtonImage = document.createElement("img");
    leftButtonImage.src = "/assets/images/arrow_key_left.svg";
    const rightButtonImage = document.createElement("img");
    rightButtonImage.src = "/assets/images/arrow_key_right.svg";
    const upButtonImage = document.createElement("img");
    upButtonImage.src = "/assets/images/arrow_key_top.svg";
    const downButtonImage = document.createElement("img");
    downButtonImage.src = "/assets/images/arrow_key_bottom.svg";

    this.leftKey = document.createElement("button");
    this.leftKey.className = "w-[25px] h-[25px] focus:outline-none";
    this.leftKey.appendChild(leftButtonImage);
    this.downKey = document.createElement("button");
    this.downKey.className = "w-[25px] h-[25px] focus:outline-none";
    this.downKey.appendChild(downButtonImage);
    this.upKey = document.createElement("button");
    this.upKey.className = "w-[25px] h-[25px] focus:outline-none";
    this.upKey.appendChild(upButtonImage);
    this.rightKey = document.createElement("button");
    this.rightKey.className = "w-[25px] h-[25px] focus:outline-none";
    this.rightKey.appendChild(rightButtonImage);

    const keyBoxStyle = {
      width: window.innerWidth / this.cameras.main.zoom + "px",
      paddingLeft: "5px",
      paddingRight: "5px",
    };
    this.keyBox = this.add
      .dom(0, 0, "div", keyBoxStyle)
      .setOrigin(0, 0)
      .setScrollFactor(0, 0)
      .setPosition(
        window.innerWidth / 2 - window.innerWidth / this.cameras.main.zoom / 2,
        window.innerHeight / 2 + 280 / this.cameras.main.zoom
      );

    this.keyBox.setClassName("!flex justify-between");

    this.keyBox.node.appendChild(this.leftKey);
    this.keyBox.node.appendChild(this.downKey);
    this.keyBox.node.appendChild(this.upKey);
    this.keyBox.node.appendChild(this.rightKey);

    //배치 에셋 범위 표시 박스 ///////////////////////////////////////
    const color = 0x39a7ff;
    const errorColor = 0xb83818;
    const thickness = 0.5;
    const alpha = 1;

    this.defaultSpriteBox = this.add
      .graphics()
      .lineStyle(thickness, color, alpha)
      .fillStyle(color, 0.5)
      .fillRect(0, 0, 32, 32)
      .strokeRect(0, 0, 32, 32)
      .setDepth(3);

    this.errorSpriteBox = this.add
      .graphics()
      .lineStyle(thickness, errorColor, alpha)
      .fillStyle(errorColor, 0.5)
      .fillRect(0, 0, 32, 32)
      .strokeRect(0, 0, 32, 32)
      .setDepth(3);

    const gridEngineConfig = {
      snapToCell: true,
      characters: trees.concat(flowers),
    };

    // @ts-ignore
    this.sys.animatedTiles.init(map);
    this.cameras.main.scrollY = 0;
    this.gridEngine.create(map, gridEngineConfig);

    if (
      this.gridEngine.isBlocked({
        x: this.gridEngine.getPosition(this.selectedTreeHandle).x,
        y: this.gridEngine.getPosition(this.selectedTreeHandle).y,
      }) ||
      this.gridEngine.isBlocked({
        x: this.gridEngine.getPosition(this.selectedTreeHandle).x,
        y: this.gridEngine.getPosition(this.selectedTreeHandle).y + 1,
      }) ||
      this.gridEngine.isBlocked({
        x: this.gridEngine.getPosition(this.selectedTreeHandle).x + 1,
        y: this.gridEngine.getPosition(this.selectedTreeHandle).y,
      }) ||
      this.gridEngine.isBlocked({
        x: this.gridEngine.getPosition(this.selectedTreeHandle).x + 1,
        y: this.gridEngine.getPosition(this.selectedTreeHandle).y + 1,
      })
    ) {
      // this.spriteBox = this.errorSpriteBox;
      this.errorSpriteBox.setVisible(true);
      this.defaultSpriteBox.setVisible(false);
    } else {
      // this.spriteBox = this.defaultSpriteBox;
      this.errorSpriteBox.setVisible(false);
      this.defaultSpriteBox.setVisible(true);
    }
  }

  update() {
    //에셋 배치시 나무, 꽃 테두리 보여주기.////////////////////////////////
    // this.spriteBox.setX(this.assetSprite.x);
    // this.spriteBox.setY(this.assetSprite.y);
    this.defaultSpriteBox.setX(this.assetSprite.x);
    this.defaultSpriteBox.setY(this.assetSprite.y);
    this.errorSpriteBox.setX(this.assetSprite.x);
    this.errorSpriteBox.setY(this.assetSprite.y);
    //스프라이트와 키입력 변수
    const sprite = this.assetSprite;
    // 카메라 추적 로직./////////////////////////////////////////////////
    // 맵과 스크린 테두리가 맞을시 카메라 멈추기.
    // 다시 범위에 들어오면 추적
    // sprite.x => 맵에서 x축 위치 확대된 배율만큼 곱해줘야함
    if (this.moveCheck) {
      if (
        ((sprite.x + 8) * this.cameras.main.zoom <= window.innerWidth / 2 ||
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
          -this.assetSprite.height / 8
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
          -this.assetSprite.width / 8,
          sprite.y - 144 - sprite.height / 8
        );
      }
    }

    //sprite 이동 로직//////////////////////////////////////////////////
    //좌측 버튼
    this.leftKey.onclick = () => {
      this.moveCheck = true;
      if (this.gridEngine.getPosition(this.selectedTreeHandle).x - 1 >= 0)
        this.gridEngine.setPosition(this.selectedTreeHandle, {
          x: this.gridEngine.getPosition(this.selectedTreeHandle).x - 1,
          y: this.gridEngine.getPosition(this.selectedTreeHandle).y,
        });

      //이동한 좌표에 장애물 존재시 박스 교체.

      if (
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(this.selectedTreeHandle).x,
          y: this.gridEngine.getPosition(this.selectedTreeHandle).y,
        }) ||
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(this.selectedTreeHandle).x,
          y: this.gridEngine.getPosition(this.selectedTreeHandle).y + 1,
        }) ||
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(this.selectedTreeHandle).x + 1,
          y: this.gridEngine.getPosition(this.selectedTreeHandle).y,
        }) ||
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(this.selectedTreeHandle).x + 1,
          y: this.gridEngine.getPosition(this.selectedTreeHandle).y + 1,
        })
      ) {
        this.errorSpriteBox.setVisible(true);
        this.defaultSpriteBox.setVisible(false);
      } else {
        // this.spriteBox = this.defaultSpriteBox;
        this.errorSpriteBox.setVisible(false);
        this.defaultSpriteBox.setVisible(true);
      }

      this.moveCheck = false;
    };
    //우측 버튼
    this.rightKey.onclick = () => {
      this.moveCheck = true;
      if (this.gridEngine.getPosition(this.selectedTreeHandle).x + 1 < 29)
        this.gridEngine.setPosition(this.selectedTreeHandle, {
          x: this.gridEngine.getPosition(this.selectedTreeHandle).x + 1,
          y: this.gridEngine.getPosition(this.selectedTreeHandle).y,
        });

      if (
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(this.selectedTreeHandle).x,
          y: this.gridEngine.getPosition(this.selectedTreeHandle).y,
        }) ||
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(this.selectedTreeHandle).x,
          y: this.gridEngine.getPosition(this.selectedTreeHandle).y + 1,
        }) ||
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(this.selectedTreeHandle).x + 1,
          y: this.gridEngine.getPosition(this.selectedTreeHandle).y,
        }) ||
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(this.selectedTreeHandle).x + 1,
          y: this.gridEngine.getPosition(this.selectedTreeHandle).y + 1,
        })
      ) {
        this.errorSpriteBox.setVisible(true);
        this.defaultSpriteBox.setVisible(false);
      } else {
        // this.spriteBox = this.defaultSpriteBox;
        this.errorSpriteBox.setVisible(false);
        this.defaultSpriteBox.setVisible(true);
      }

      this.moveCheck = false;
    };
    //위 버튼
    this.upKey.onclick = () => {
      this.moveCheck = true;
      if (this.gridEngine.getPosition(this.selectedTreeHandle).y - 1 >= 0)
        this.gridEngine.setPosition(this.selectedTreeHandle, {
          x: this.gridEngine.getPosition(this.selectedTreeHandle).x,
          y: this.gridEngine.getPosition(this.selectedTreeHandle).y - 1,
        });

      if (
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(this.selectedTreeHandle).x,
          y: this.gridEngine.getPosition(this.selectedTreeHandle).y,
        }) ||
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(this.selectedTreeHandle).x,
          y: this.gridEngine.getPosition(this.selectedTreeHandle).y + 1,
        }) ||
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(this.selectedTreeHandle).x + 1,
          y: this.gridEngine.getPosition(this.selectedTreeHandle).y,
        }) ||
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(this.selectedTreeHandle).x + 1,
          y: this.gridEngine.getPosition(this.selectedTreeHandle).y + 1,
        })
      ) {
        this.errorSpriteBox.setVisible(true);
        this.defaultSpriteBox.setVisible(false);
      } else {
        // this.spriteBox = this.defaultSpriteBox;
        this.errorSpriteBox.setVisible(false);
        this.defaultSpriteBox.setVisible(true);
      }

      this.moveCheck = false;
    };
    //아래 버튼
    this.downKey.onclick = () => {
      this.moveCheck = true;
      if (this.gridEngine.getPosition(this.selectedTreeHandle).y + 1 < 19)
        this.gridEngine.setPosition(this.selectedTreeHandle, {
          x: this.gridEngine.getPosition(this.selectedTreeHandle).x,
          y: this.gridEngine.getPosition(this.selectedTreeHandle).y + 1,
        });

      if (
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(this.selectedTreeHandle).x,
          y: this.gridEngine.getPosition(this.selectedTreeHandle).y,
        }) ||
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(this.selectedTreeHandle).x,
          y: this.gridEngine.getPosition(this.selectedTreeHandle).y + 1,
        }) ||
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(this.selectedTreeHandle).x + 1,
          y: this.gridEngine.getPosition(this.selectedTreeHandle).y,
        }) ||
        this.gridEngine.isBlocked({
          x: this.gridEngine.getPosition(this.selectedTreeHandle).x + 1,
          y: this.gridEngine.getPosition(this.selectedTreeHandle).y + 1,
        })
      ) {
        this.errorSpriteBox.setVisible(true);
        this.defaultSpriteBox.setVisible(false);
      } else {
        // this.spriteBox = this.defaultSpriteBox;
        this.errorSpriteBox.setVisible(false);
        this.defaultSpriteBox.setVisible(true);
      }

      this.moveCheck = false;
    };
  }
}
