import Vector from "./vector";
import tigerImg from "./assets/tiger.png";
import { collide, entitiesCollide } from "./physics";
import { SCALE, SIZE } from "./constants";
import deathSound from "./assets/oof.mp3";

class Monster {
  constructor(sk, map, sprites, width, height, mario) {
    this.sk = sk;
    this.map = map;
    this.sprites = sprites;
    this.currentSprite = 0;
    this.pos = new Vector(0, 0);
    this.jumpForce = new Vector(0, 0);
    this.jumpBlocked = false;
    this.height = height;
    this.width = width;
    this.speed = 0.002;
    this.direction = "left";
    this.mario = mario;
    this.dead = false;

    this.deathSound = document.createElement("audio");
  }

  walk(distance) {
    if (this.dead) return;

    if (distance < 0) {
      this.direction = "left";
    } else {
      this.direction = "right";
    }
    const nextPos = this.pos.add(distance, 0);
    const collision = collide(nextPos, this.map, this.width, this.height);
    if (collision) {
      this.speed *= -1;

      const leftCollision = collision.subV(this.pos).x < 0;
      if (leftCollision) this.pos.x = collision.x + 1;
      else this.pos.x = collision.x - this.width;
    } else {
      this.pos = nextPos;
    }
  }

  update(deltaTime) {
    if (this.dead) return;

    if (this.sk.frameCount % 15 === 0) {
      this.currentSprite++;
      if (this.currentSprite >= this.sprites.length) this.currentSprite = 0;
    }
    if (entitiesCollide(this, this.mario)) {
      if (
        this.pos.subV(this.mario.pos).y - this.mario.height > -0.09 &&
        this.mario.jumpForce.y < 0
      ) {
        this.dead = true;
      } else {
        this.mario.currentHealth -= 2;
      }
    }

    this.walk(this.speed * deltaTime);

    const nextPos = this.pos.subV(this.jumpForce);
    const collision = collide(nextPos, this.map, this.width, this.height);
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
    if (this.dead) return;

    let x = this.pos.x * SIZE;
    let y = this.pos.y * SIZE;
    let width = SIZE * this.width;
    let height = SIZE * this.height;

    if (this.direction === "right") {
      this.sk.scale(-1, 1);
      x = -x - SIZE * this.width;
    }

    this.sk.image(this.sprites[this.currentSprite], x, y, width, height);
  }
}

export default Monster;
