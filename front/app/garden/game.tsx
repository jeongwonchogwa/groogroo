"use client";

import { useEffect, useState } from "react";
import MainScene from "./mainScene";
import Preloader from "./preloader";
import GridEngine from "grid-engine";

const Game = () => {
  // const [game, setGame] = useState<Phaser.Game>();

  useEffect(() => {
    console.log("높이" + window.innerHeight + "너비" + window.innerWidth);
    const initPhaser = () => {
      const phaserGame = new Phaser.Game({
        type: Phaser.AUTO,
        title: "게임 타이틀",
        parent: "game-content",
        // 맵 크기
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x000000,
        scene: [Preloader, MainScene],
        pixelArt: true,
        scale: {
          // zoom: window.innerHeight / 320,
          // mode: Phaser.Scale.FIT,
          // autoCenter: Phaser.Scale.CENTER_BOTH,
          // mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
          // width: window.innerWidth,
          // height: window.innerHeight,
        },
        physics: {
          default: "arcade",
          arcade: {
            // debug: true,
          },
        },

        plugins: {
          scene: [
            {
              key: "gridEngine",
              plugin: GridEngine,
              mapping: "gridEngine",
            },
          ],
        },
      });

      // setGame(phaserGame);
    };

    initPhaser();
  }, []);

  return (
    <div className="w-full h-full overflow-hidden">
      <div id="game-content" key="game-content"></div>
    </div>
  );
};

export default Game;
