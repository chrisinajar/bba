import Phaser from "phaser";

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super("MainMenu");
  }

  init() {
    this.keys = this.input.keyboard.addKeys(
      { continue: Phaser.Input.Keyboard.KeyCodes.SPACE },
      true
    );
  }

  preload() {
    this.load.setBaseURL("http://labs.phaser.io");

    this.load.image("sky", "assets/skies/bigsky.png");
    this.load.image("logo", "assets/sprites/phaser3-logo.png");
    this.load.image("red", "assets/particles/red.png");
  }

  create() {
    this.add.image(400, 300, "sky");

    var particles = this.add.particles("red");

    var emitter = particles.createEmitter({
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: "ADD",
    });

    var logo = this.physics.add.image(400, 100, "logo");

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);
  }

  update() {
    if (this.keys.continue.isDown) {
      this.scene.switch("GameStart");
    }
  }
}
