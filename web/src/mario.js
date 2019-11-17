import Vector from "./vector";
import marioImg from "./assets/mario.png";
import { collide } from "./physics";
import { SCALE } from "./constants";

const SPEED = 0.5;
const DUCKED_SIZE = 1;

class Mario {
  constructor(sk, map) {
    this.sk = sk;
    this.map = map;
    this.marioImg = sk.loadImage(marioImg);
    this.pos = new Vector(0, 500);
    this.marioJumpForce = new Vector(0, 0);
    this.jumpBlocked = false;
    this.ducked = false;
  }

  input(deltaTime) {
    if (this.sk.keyIsDown(65)) {
      // LEFT
      const nextPos = this.pos.sub(SPEED * deltaTime, 0);
      const collision = collide(
        nextPos.div(16 * SCALE),
        this.map,
        this.ducked ? DUCKED_SIZE : 1.5
      );
      if (collision) {
        const realPos = collision.mul(16 * SCALE);
        this.pos.x = realPos.x + 16 * SCALE;
      } else {
        this.pos = nextPos;
      }
    }
    if (this.sk.keyIsDown(68)) {
      // RIGHT
      const nextPos = this.pos.add(SPEED * deltaTime, 0);
      const collision = collide(
        nextPos.div(16 * SCALE),
        this.map,
        this.ducked ? DUCKED_SIZE : 1.5
      );
      if (collision) {
        const realPos = collision.mul(16 * SCALE);
        this.pos.x = realPos.x - 16 * SCALE;
      } else {
        this.pos = nextPos;
      }
    }
    if (this.sk.keyIsDown(32) && !this.jumpBlocked) {
      // SPACE
      this.marioJumpForce = new Vector(0, 10);
      this.jumpBlocked = true;
    }
    if (this.sk.keyIsDown(16)) {
      this.ducked = true;
      this.pos = this.pos.add(0, 0.5 * SCALE * 16);
    } else {
      this.ducked = false;
      const nextPos = this.pos.sub(0, 0.5 * SCALE * 16);
      const collision = collide(
        nextPos.div(16 * SCALE),
        this.map,
        this.ducked ? DUCKED_SIZE : 1.5
      );
      if (collision) {
        // const realPos = collision.mul(16 * SCALE);
        // this.pos.x = realPos.x - 16 * SCALE;
        console.log("fuck");
      } else {
        // this.pos = nextPos;
      }
    }
  }

  update(deltaTime) {
    const nextPos = this.pos.subV(this.marioJumpForce);
    const collision = collide(
      nextPos.div(16 * SCALE),
      this.map,
      this.ducked ? DUCKED_SIZE : 1.5
    );
    if (collision) {
      const realPos = collision.mul(16 * SCALE);
      this.pos.y = realPos.y - 16 * SCALE * (this.ducked ? DUCKED_SIZE : 1.5);
    } else {
      this.pos = nextPos;
    }

    this.marioJumpForce = this.marioJumpForce.sub(0, 0.035 * deltaTime);
    if (collision) {
      this.jumpBlocked = false;
      this.marioJumpForce = new Vector(0, 0);
    }

    if (this.pos.y > 2000) {
      this.respawn();
    }
  }

  respawn() {
    this.pos = new Vector();
  }

  draw() {
    this.sk.image(
      this.marioImg,
      this.pos.x,
      this.pos.y,
      16 * SCALE,
      16 * SCALE * (this.ducked ? DUCKED_SIZE : 1.5)
    );
  }
}

export default Mario;
