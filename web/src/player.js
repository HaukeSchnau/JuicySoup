import Vector from "./vector";
import marioImg from "./assets/mario.png";
import { collide } from "./physics";
import { SCALE, SIZE } from "./constants";
import * as Game from "./game";
import Bullet from "./bullet";

class Player {
  constructor(map) {
    this.map = map;
    this.sprite = loadImage(marioImg);
    this.pos = Game.map.spawnPoint.copy();
    this.jumpForce = new Vector(0, 0);
    this.jumpBlocked = false;
    this.ducked = false;
    this.direction = "right";
    this.maxHealth = 100;
    this.currentHealth = this.maxHealth;
    this.score = 0;
  }

  get width() {
    return 1;
  }

  get height() {
    return this.ducked ? 1 : 1.5;
  }

  get speed() {
    return this.ducked ? 0.005 : 0.0078125;
  }

  kill(entity) {
    this.score += 10;
    entity.dead = true;
  }

  input() {
    if (keyIsDown(65)) {
      // LEFT
      this.direction = "left";
      const nextPos = this.pos.sub(this.speed * deltaTime, 0);
      const collision = collide(nextPos, this.width, this.height);
      if (collision) {
        this.pos.x = collision.x + 1;
      } else {
        this.pos = nextPos;
      }
    }
    if (keyIsDown(68)) {
      // RIGHT
      this.direction = "right";
      const nextPos = this.pos.add(this.speed * deltaTime, 0);
      const collision = collide(nextPos, this.width, this.height);
      if (collision) {
        this.pos.x = collision.x - 1;
      } else {
        this.pos = nextPos;
      }
    }
    if (keyIsDown(32) && !this.jumpBlocked) {
      // SPACE
      this.jumpForce = new Vector(0, 0.17);
    }
    if (keyIsDown(16)) {
      if (!this.ducked) this.pos = this.pos.add(0, 0.5);
      this.ducked = true;
    } else {
      if (this.ducked) {
        const nextPos = this.pos.sub(0, 0.5);
        const collision = collide(nextPos, this.width, this.height);
        if (!collision) {
          this.ducked = false;
        }
      }
    }
  }

  mouseClicked() {
    const bulletSpeed = 0.3;
    Game.gameObjects.push(
      new Bullet(
        this.pos.add(this.width / 2, this.height / 2),
        new Vector(mouseX, mouseY)
          .subV(Game.camera.pos)
          .div(SIZE)
          .subV(this.pos.add(this.width / 2, this.height / 2))
          .normalize()
          .mul(bulletSpeed)
      )
    );
  }

  update() {
    if (this.currentHealth <= 0) {
      this.currentHealth = true;
      Game.setShowDeathScreen(true);
    }

    const nextPos = this.pos.subV(this.jumpForce);
    const collision = collide(nextPos, this.width, this.height);
    if (collision) {
      const headCollision = collision.subV(this.pos).y < 0;

      if (headCollision) {
        this.pos.y = collision.y + 1;
      } else {
        this.pos.y = collision.y - this.height;
        this.jumpBlocked = false;
      }
      this.jumpForce = new Vector(0, 0);
    } else {
      this.jumpBlocked = true;
      this.jumpForce = this.jumpForce.sub(0, 0.000546875 * deltaTime);
      this.pos = nextPos;
    }

    if (this.pos.y > 50) {
      Game.setShowDeathScreen(true);
    }
  }

  respawn() {
    this.pos = Game.map.spawnPoint.copy();
    this.currentHealth = this.maxHealth;
  }

  draw() {
    let x = this.pos.x * SIZE;
    let y = this.pos.y * SIZE;
    let width = SIZE;
    let height = SIZE * this.height;

    push();
    if (this.direction === "right") {
      scale(-1, 1);
      x = -x - SIZE;
    }

    image(this.sprite, x, y, width, height);
    pop();
    const healthBarWidth = 150;
    const healthBarHeight = 20;
    fill("#ff0000");
    rect(
      this.pos.x * SIZE - healthBarWidth / 2 + SIZE / 2,
      this.pos.y * SIZE - healthBarHeight,
      healthBarWidth,
      healthBarHeight
    );
    fill("#00ff3e");
    rect(
      this.pos.x * SIZE - healthBarWidth / 2 + SIZE / 2,
      this.pos.y * SIZE - healthBarHeight,
      healthBarWidth * (this.currentHealth / this.maxHealth),
      healthBarHeight
    );
    textAlign(CENTER, CENTER);
    fill("#000");
    text(
      Math.round(this.currentHealth) + " HP",
      this.pos.x * SIZE + SIZE / 2,
      this.pos.y * SIZE - healthBarHeight + healthBarHeight / 2
    );
  }
}

export default Player;
