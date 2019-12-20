import Vector from "../vector";
import { collide } from "../physics";
import { SIZE } from "../constants";

class Entity {
  constructor(map, sprites, initialPos, width, height) {
    this.map = map;
    this.sprites = sprites;
    this.currentSprite = 0;
    this.initialPos = initialPos.copy();
    this.pos = initialPos.copy();
    this.jumpForce = new Vector(0, 0);
    this.height = height;
    this.width = width;
    this.dead = false;
    this.noPhysics = false;
    this.distanceTraveled = 0;
  }

  update() {
    if (this.dead) return;

    if (!this.noPhysics) {
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
        this.distanceTraveled += this.jumpForce.length();
      }
    }
  }

  draw() {
    if (this.dead) return;

    let x = this.pos.x * SIZE;
    let y = this.pos.y * SIZE;
    let width = SIZE * this.width;
    let height = SIZE * this.height;

    image(this.sprites[this.currentSprite], x, y, width, height);
  }
}

export default Entity;
