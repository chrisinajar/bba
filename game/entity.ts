import Phaser from "phaser";

export default class EntityBase {
  x: number = 0;
  y: number = 0;

  init(scene: Phaser.Scene) {}
  preload(scene: Phaser.Scene) {}
  create(scene: Phaser.Scene) {}
  update(scene: Phaser.Scene) {}
}
