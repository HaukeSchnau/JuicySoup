import Vector from "./vector";
import marioImg from "./assets/mario.png";
import { collide } from "./physics";
import { SCALE, SIZE } from "./constants";

const SPEED = 0.0078125;
const DUCKED_SIZE = 1;

class Mario {
  constructor(sk, map) {
    this.sk = sk;
    this.map = map;
    this.marioImg = sk.loadImage(marioImg);
    this.pos = new Vector(0, 0);
    this.marioJumpForce = new Vector(0, 0);
    this.jumpBlocked = false;
    this.ducked = false;
  }

  input(deltaTime) {
    if (this.sk.keyIsDown(65)) {
      // LEFT
      const nextPos = this.pos.sub(SPEED * deltaTime, 0);
      const collision = collide(
        nextPos,
        this.map,
        this.ducked ? DUCKED_SIZE : 1.5
      );
      if (collision) {
        this.pos.x = collision.x + 1;
      } else {
        this.pos = nextPos;
      }
    }
    if (this.sk.keyIsDown(68)) {
      // RIGHT
      const nextPos = this.pos.add(SPEED * deltaTime, 0);
      const collision = collide(
        nextPos,
        this.map,
        this.ducked ? DUCKED_SIZE : 1.5
      );
      if (collision) {
        this.pos.x = collision.x - 1;
      } else {
        this.pos = nextPos;
      }
    }
    if (this.sk.keyIsDown(32) && !this.jumpBlocked) {
      // SPACE
      this.marioJumpForce = new Vector(0, 0.15625);
    }
    if (this.sk.keyIsDown(16)) {
      this.ducked = true;
      this.pos = this.pos.add(0, 0.5);
    } else {
      if (this.ducked) {
        this.ducked = false;
        const nextPos = this.pos.sub(0, 0.5);
        const collision = collide(
          nextPos,
          this.map,
          this.ducked ? DUCKED_SIZE : 1.5
        );
        if (collision) {
          this.ducked = true;
        }
      }
    }
  }

  update(deltaTime) {
    const nextPos = this.pos.subV(this.marioJumpForce);
    const collision = collide(
      nextPos,
      this.map,
      this.ducked ? DUCKED_SIZE : 1.5
    );
    if (collision) {
      const headCollision = collision.subV(this.pos).y < 0;

      if (headCollision) {
        this.pos.y = collision.y + 1;
      } else {
        this.pos.y = collision.y - (this.ducked ? DUCKED_SIZE : 1.5);
        this.jumpBlocked = false;
      }
      this.marioJumpForce = new Vector(0, 0);
    } else {
      this.jumpBlocked = true;
      this.marioJumpForce = this.marioJumpForce.sub(0, 0.000546875 * deltaTime);
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
      SIZE * (this.ducked ? DUCKED_SIZE : 1.5)
    );
  }
}

export default Mario;
