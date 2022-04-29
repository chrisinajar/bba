import Phaser from "phaser";

import Entity from "./entity";

enum PlayerState {
  Idle = "idle",
  LandingLag = "landingLag",
  LongLandingLag = "longLandingLag",
  JumpSquat = "jumpSquat",
  Running = "running",
  AirRising = "airRising",
  AirFalling = "airFalling",

  GroundedForwardAttack = "groundedForwardAttack",
  AerialForwardAttack = "aerialForwardAttack",
}

export default class Player extends Entity {
  constructor() {
    super();
    console.log("Player class initiated!");
  }

  init(scene: Phaser.Scene) {
    this.keys = scene.input.keyboard.addKeys(
      {
        faceLeft: Phaser.Input.Keyboard.KeyCodes.LEFT,
        faceRight: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        faceUp: Phaser.Input.Keyboard.KeyCodes.UP,
        faceDown: Phaser.Input.Keyboard.KeyCodes.DOWN,

        moveLeft: Phaser.Input.Keyboard.KeyCodes.A,
        moveRight: Phaser.Input.Keyboard.KeyCodes.D,
        moveUp: Phaser.Input.Keyboard.KeyCodes.W,
        moveDown: Phaser.Input.Keyboard.KeyCodes.S,

        attack: Phaser.Input.Keyboard.KeyCodes.SPACE,
      },
      true
    );

    this.state = null;
    this.isFacingLeft = false;
    this.isGrounded = false;
    this.jumpCharge = 0;
  }

  preload(scene: Phaser.Scene) {
    scene.load.spritesheet("player", "sprites/adventurer.png", {
      frameWidth: 50,
      frameHeight: 37,
    });
  }

  create(scene: Phaser.Scene) {
    const playerAnimations = {
      [PlayerState.Idle]: scene.anims.create({
        key: PlayerState.Idle,
        frames: scene.anims.generateFrameNumbers("player", {
          frames: [0, 1, 2, 3],
          // frames: [38, 39, 40, 41],
        }),
        frameRate: 6,
        repeat: -1,
      }),
      [PlayerState.JumpSquat]: scene.anims.create({
        key: PlayerState.JumpSquat,
        frames: scene.anims.generateFrameNumbers("player", {
          frames: [4, 5, 6, 7],
        }),
        frameRate: 4,
        repeat: -1,
      }),
      [PlayerState.Running]: scene.anims.create({
        key: PlayerState.Running,
        frames: scene.anims.generateFrameNumbers("player", {
          frames: [8, 9, 10, 11, 12, 13],
        }),
        frameRate: 8,
        repeat: -1,
      }),
      [PlayerState.LandingLag]: scene.anims.create({
        key: PlayerState.LandingLag,
        frames: scene.anims.generateFrameNumbers("player", {
          frames: [15, 14],
        }),
        frameRate: 8,
      }),
      [PlayerState.LongLandingLag]: scene.anims.create({
        key: PlayerState.LongLandingLag,
        frames: scene.anims.generateFrameNumbers("player", {
          frames: [66, 67, 15, 14],
        }),
        frameRate: 8,
      }),

      [PlayerState.AirRising]: scene.anims.create({
        key: PlayerState.AirRising,
        frames: scene.anims.generateFrameNumbers("player", {
          frames: [16, 17, 18, 19, 20, 21],
        }),
        frameRate: 8,
        repeat: -1,
      }),
      [PlayerState.AirFalling]: scene.anims.create({
        key: PlayerState.AirFalling,
        frames: scene.anims.generateFrameNumbers("player", {
          frames: [22, 23],
        }),
        frameRate: 8,
        repeat: -1,
      }),

      // attacks
      [PlayerState.GroundedForwardAttack]: scene.anims.create({
        key: PlayerState.GroundedForwardAttack,
        frames: scene.anims.generateFrameNumbers("player", {
          frames: [47, 50, 52, 74],
        }),
        frameRate: 8,
        repeat: 0,
      }),
      [PlayerState.AerialForwardAttack]: scene.anims.create({
        key: PlayerState.AerialForwardAttack,
        frames: scene.anims.generateFrameNumbers("player", {
          frames: [96, 97, 98, 99, 102],
        }),
        frameRate: 8,
        repeat: 0,
      }),
    };

    this.sprite = scene.physics.add.sprite(400, 400, "player");
    this.sprite.scale = 2;
    this.sprite.body.setAllowDrag(true);
    this.sprite.body.setDrag(200, 10);

    console.log(PlayerState.Idle);
    this.setState(PlayerState.Idle);

    this.sprite.on("animationcomplete", (data) => {
      this.setState(PlayerState.Idle);
    });
  }

  setState(state: PlayerState) {
    if (this.state === state) {
      return;
    }
    this.state = state;
    this.sprite.play(state);
  }

  update(scene: Phaser.Scene) {
    this.sprite.body.setAccelerationX(0);
    const isGrounded = this.sprite.body.touching.down;
    this.sprite.flipX = this.isFacingLeft;

    if (isGrounded) {
      if (
        this.state === PlayerState.AirFalling ||
        this.state === PlayerState.AirRising
      ) {
        this.setState(PlayerState.LandingLag);
      }
      if (this.state === PlayerState.AerialForwardAttack) {
        this.setState(PlayerState.LongLandingLag);
      }
      if (
        this.state === PlayerState.Running ||
        this.state === PlayerState.Idle
      ) {
        if (this.keys.attack.isDown) {
          this.setState(PlayerState.GroundedForwardAttack);
        }
      }
      if (this.keys.moveRight.isDown || this.keys.moveLeft.isDown) {
        if (this.state === PlayerState.Idle) {
          this.setState(PlayerState.Running);
          if (this.keys.moveLeft.isDown) {
            this.sprite.body.setVelocityX(-200);
          } else {
            this.sprite.body.setVelocityX(200);
          }
        } else if (this.state === PlayerState.Running) {
        }
      } else {
        if (this.state === PlayerState.Running) {
          this.setState(PlayerState.Idle);
        }
      }

      if (this.keys.moveUp.isDown) {
        if (
          this.state === PlayerState.Idle ||
          this.state === PlayerState.Running
        ) {
          this.jumpCharge = 0;
          this.setState(PlayerState.JumpSquat);
        }
        if (this.state === PlayerState.JumpSquat) {
          this.jumpCharge += 1;
        }
      } else if (this.state === PlayerState.JumpSquat) {
        const charge = Math.min(100, this.jumpCharge) / 100;
        const curveCharge = 1 - Math.pow(1 - charge, 3);
        this.sprite.body.setVelocityY(0 - (200 + curveCharge * 300));
        this.setState(PlayerState.Idle);
      }
    } else {
      // in the air
      if (
        this.state === PlayerState.Running ||
        this.state === PlayerState.Idle ||
        this.state === PlayerState.GroundedForwardAttack ||
        this.state === PlayerState.JumpSquat
      ) {
        if (this.sprite.body.velocity.y > 0) {
          // moving down
          this.setState(PlayerState.AirFalling);
        } else {
          this.setState(PlayerState.AirRising);
        }
        console.log("Become airborn!!");
      }

      if (
        this.sprite.body.velocity.y > 0 &&
        this.state === PlayerState.AirRising
      ) {
        // moving down
        this.setState(PlayerState.AirFalling);
      } else if (
        this.sprite.body.velocity.y < 0 &&
        this.state === PlayerState.AirFalling
      ) {
        this.setState(PlayerState.AirRising);
      }

      if (
        this.state === PlayerState.AirFalling ||
        this.state === PlayerState.AirRising
      ) {
        if (this.keys.attack.isDown) {
          this.setState(PlayerState.AerialForwardAttack);
        }
      }
    }

    const maxSpeed = isGrounded ? 200 : 250;
    let acceleration = 100;

    if (this.state === PlayerState.Running) {
      acceleration *= 10;
      this.sprite.body.setDragX(200);
    } else if (isGrounded) {
      this.sprite.body.setDragX(600);
    } else {
      acceleration *= 6;
      this.sprite.body.setDragX(150);
    }

    if (
      this.state === PlayerState.Running ||
      this.state === PlayerState.Idle ||
      !isGrounded
    ) {
      if (this.keys.moveLeft.isDown) {
        if (this.sprite.body.velocity.x > 0 - maxSpeed) {
          this.sprite.body.setAccelerationX(0 - acceleration);
        }
      } else if (this.keys.moveRight.isDown) {
        if (this.sprite.body.velocity.x < maxSpeed) {
          this.sprite.body.setAccelerationX(acceleration);
        }
      }

      if (
        isGrounded ||
        this.state === PlayerState.AirFalling ||
        this.state === PlayerState.AirRising
      ) {
        if (this.keys.faceRight.isDown) {
          this.isFacingLeft = false;
        } else if (this.keys.faceLeft.isDown) {
          this.isFacingLeft = true;
        } else if (this.keys.moveRight.isDown) {
          this.isFacingLeft = false;
        } else if (this.keys.moveLeft.isDown) {
          this.isFacingLeft = true;
        }
      }
    }
  }
}
