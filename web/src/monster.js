import Vector from "./vector";
import tigerImg from "./assets/tiger.png";
import { collide, entitiesCollide } from "./physics";
import { SCALE, SIZE } from "./constants";
import deathSound from "./assets/oof.mp3";
import Sound from "./sound";
import * as Game from "./game";

class Monster {
  constructor(map, sprites, x, y, width, height) {
    this.map = map;
    this.sprites = sprites;
    this.currentSprite = 0;
    this.pos = new Vector(x, y);
    this.jumpForce = new Vector(0, 0);
    this.jumpBlocked = false;
    this.height = height;
    this.width = width;
    this.speed = 0.002;
    this.direction = "left";
    this.dead = false;

    this.deathSound = new Sound(deathSound);
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

    if (frameCount % 15 === 0) {
      this.currentSprite++;
      if (this.currentSprite >= this.sprites.length) this.currentSprite = 0;
    }
    if (entitiesCollide(this, Game.mario)) {
      if (
        this.pos.subV(Game.mario.pos).y - Game.mario.height > -0.2 &&
        Game.mario.jumpForce.y < 0
      ) {
        this.dead = true;
        Game.mario.score += 10;
        this.deathSound.play();
      } else {
        Game.mario.currentHealth -= 2;
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
      scale(-1, 1);
      x = -x - SIZE * this.width;
    }

    image(this.sprites[this.currentSprite], x, y, width, height);
  }
}

export default Monster;
