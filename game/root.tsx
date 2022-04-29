import React, { useEffect } from "react";
import Phaser from "phaser";

import Container from "@mui/material/Container";

import MainMenu from "./scenes/menu";
import GameStart from "./scenes/start";

export default function GameComponent(): JSX.Element {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      parent: "game-container",
      width: 800,
      height: 600,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 200 },
        },
      },
      scene: [GameStart, MainMenu],
    };
    console.log("Starting game!");
    const game = new Phaser.Game(config);
    console.log(game);

    return () => game.destroy(true);
  }, []);

  return (
    <Container>
      <div style={{ display: "flex" }}>
        <div
          style={{ border: "4px solid black", display: "flex" }}
          id="game-container"
        />
      </div>
    </Container>
  );
}
