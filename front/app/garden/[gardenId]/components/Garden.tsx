"use client";

import { useEffect, useState } from "react";
import GardenScene from "./GardenScene";
import Preloader from "./Preloader";
import GridEngine from "grid-engine";
import GardenHeader from "./GardenHeader";
import GardenEditScene from "./GardenEditScene";
import { gardenEditStore } from "@/stores/gardenEditStore";
const Garden = () => {
  const { gardenEdit } = gardenEditStore();
  const getTree = async () => {
    try {
    } catch (error) {}
  };

  useEffect(() => {
    const initPhaser = () => {
      const phaserGame = new Phaser.Game({
        type: Phaser.AUTO,
        title: "garden",
        parent: "garden-content",
        // 맵 크기
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x000000,
        dom: {
          createContainer: true,
        },
        scene: [Preloader, GardenScene, GardenEditScene],
        pixelArt: true,

        physics: {
          default: "arcade",
          arcade: {
            debug: true,
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
    <div className="w-full h-full overflow-hidden border-2 border-point-orange ">
      <div
        className="relative w-full h-full"
        id="garden-content"
        key="garden-content"
      >
        <GardenHeader />
      </div>
    </div>
  );
};

export default Garden;
