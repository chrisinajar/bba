import Phaser from "phaser";

import Player from "../player";
import EntityManager from "../entity-manager";

export default class GameStart extends Phaser.Scene {
  constructor() {
    super("GameStart");

    this.entityManager = new EntityManager();
    this.player = new Player();
    this.entityManager.add(this.player);
  }

  init() {
    this.position = { x: 0, y: 0 };
    this.drift = 0;

    this.entityManager.init(this);
  }

  preload() {
    // this.load.setBaseURL("http://labs.phaser.io");

    this.load.image("sky", "http://labs.phaser.io/assets/skies/bigsky.png");
    this.load.image(
      "logo",
      "http://labs.phaser.io/assets/sprites/phaser3-logo.png"
    );
    this.load.image("red", "http://labs.phaser.io/assets/particles/red.png");

    // this.load.setBaseURL("/");
    this.load.image("background", "/backgrounds/game-placeholder.jpeg");

    this.entityManager.preload(this);
  }

  create() {
    this.background = this.add.tileSprite(400, 300, 800, 600, "background");
    const staticImage = this.physics.add.staticImage(400, 600, "logo");

    this.physics.world.gravity.y = 600;

    this.entityManager.create(this);

    this.physics.add.collider(this.player.sprite, staticImage);
  }

  update() {
    // this.cameras.main.setScroll(this.position.x, this.position.y);
    this.background.tilePositionX = this.position.x + this.drift;
    this.drift += 0.1;

    this.entityManager.update(this);
  }
}
