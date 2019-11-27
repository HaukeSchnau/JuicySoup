import Vector from "./vector";
import goombaImg1 from "./assets/goomba1.png";
import goombaImg2 from "./assets/goomba2.png";
import { collide } from "./physics";
import { SCALE, SIZE } from "./constants";

class Monster {
  constructor(sk, map) {
    this.sk = sk;
    this.map = map;
    this.sprites = [sk.loadImage(goombaImg1), sk.loadImage(goombaImg2)];
    this.currentSprite = 0;
    this.pos = new Vector(0, 0);
    this.jumpForce = new Vector(0, 0);
    this.jumpBlocked = false;
    this.height = 1;
    this.speed = 0.002;
    this.direction = "left";
  }

  walk(distance) {
    if (distance < 0) {
      this.direction = "left";
    } else {
      this.direction = "right";
    }
    const nextPos = this.pos.add(distance, 0);
    const collision = collide(nextPos, this.map, this.height);
    if (collision) {
      this.speed *= -1;

      const leftCollision = collision.subV(this.pos).x < 0;
      if (leftCollision) this.pos.x = collision.x + 1;
      else this.pos.x = collision.x - 1;
    } else {
      this.pos = nextPos;
    }
  }

  update(deltaTime) {
    if (this.sk.frameCount % 15 === 0) {
      this.currentSprite++;
      if (this.currentSprite >= this.sprites.length) this.currentSprite = 0;
    }

    this.walk(this.speed * deltaTime);

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
  }

  draw() {
    let x = this.pos.x * SIZE;
    let y = this.pos.y * SIZE;
    let width = SIZE;
    let height = SIZE;

    this.sk.push();
    if (this.direction === "right") {
      this.sk.scale(-1, 1);
      x = -x - SIZE;
    }

    this.sk.image(this.sprites[this.currentSprite], x, y, width, height);
    this.sk.pop();
  }
}

export default Monster;
