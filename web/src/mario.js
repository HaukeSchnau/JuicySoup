import Vector from "./vector";
import marioImg from "./assets/mario.png";
import { collide } from "./physics";
import { SCALE, SIZE } from "./constants";

class Mario {
  constructor(sk, map) {
    this.sk = sk;
    this.map = map;
    this.marioImg = sk.loadImage(marioImg);
    this.pos = new Vector(0, 0);
    this.jumpForce = new Vector(0, 0);
    this.jumpBlocked = false;
    this.ducked = false;
    this.direction = "right";
    this.maxHealth = 100;
    this.currentHealth = 69;
  }

  get height() {
    return this.ducked ? 1 : 1.5;
  }

  get speed() {
    return this.ducked ? 0.005 : 0.0078125;
  }

  input(deltaTime) {
    if (this.sk.keyIsDown(65)) {
      // LEFT
      this.direction = "left";
      const nextPos = this.pos.sub(this.speed * deltaTime, 0);
      const collision = collide(nextPos, this.map, this.height);
      if (collision) {
        this.pos.x = collision.x + 1;
      } else {
        this.pos = nextPos;
      }
    }
    if (this.sk.keyIsDown(68)) {
      // RIGHT
      this.direction = "right";
      const nextPos = this.pos.add(this.speed * deltaTime, 0);
      const collision = collide(nextPos, this.map, this.height);
      if (collision) {
        this.pos.x = collision.x - 1;
      } else {
        this.pos = nextPos;
      }
    }
    if (this.sk.keyIsDown(32) && !this.jumpBlocked) {
      // SPACE
      this.jumpForce = new Vector(0, 0.15625);
    }
    if (this.sk.keyIsDown(16)) {
      if (!this.ducked) this.pos = this.pos.add(0, 0.5);
      this.ducked = true;
    } else {
      if (this.ducked) {
        const nextPos = this.pos.sub(0, 0.5);
        const collision = collide(nextPos, this.map, this.height);
        if (!collision) {
          this.ducked = false;
        }
      }
    }
  }

  update(deltaTime) {
    const nextPos = this.pos.subV(this.jumpForce);
    const collision = collide(nextPos, this.map, this.height);
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
      this.respawn();
    }
  }

  respawn() {
    this.pos = new Vector();
  }

  draw() {
    let x = this.pos.x * SIZE;
    let y = this.pos.y * SIZE;
    let width = SIZE;
    let height = SIZE * this.height;

    this.sk.push();
    if (this.direction === "right") {
      this.sk.scale(-1, 1);
      x = -x - SIZE;
    }

    this.sk.image(this.marioImg, x, y, width, height);
    this.sk.pop();
    const healthBarWidth = 150;
    const healthBarHeight = 20;
    this.sk.fill("#ff0000");
    this.sk.rect(
      this.pos.x * SIZE - healthBarWidth / 2 + SIZE / 2,
      this.pos.y * SIZE - healthBarHeight,
      healthBarWidth,
      healthBarHeight
    );
    this.sk.fill("#00ff3e");
    this.sk.rect(
      this.pos.x * SIZE - healthBarWidth / 2 + SIZE / 2,
      this.pos.y * SIZE - healthBarHeight,
      healthBarWidth * (this.currentHealth / this.maxHealth),
      healthBarHeight
    );
    this.sk.textAlign(this.sk.CENTER);
    this.sk.fill("#000");
    this.sk.text(
      this.currentHealth + " HP",
      this.pos.x * SIZE + SIZE / 2,
      this.pos.y * SIZE - healthBarHeight + healthBarHeight / 2
    );
  }
}

export default Mario;
