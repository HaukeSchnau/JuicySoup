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
    this.sk.image(
      this.marioImg,
      this.pos.x * SIZE,
      this.pos.y * SIZE,
      SIZE,
      SIZE * this.height
    );
  }
}

export default Mario;
