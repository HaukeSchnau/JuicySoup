import Vector from "../vector";
import { collide, entitiesCollide } from "../physics";
import { SIZE } from "../constants";
import deathSound from "../assets/oof.mp3";
import Sound from "../sound";
import * as Game from "../game";

class Monster {
  constructor(
    map,
    sprites,
    initialPos,
    width,
    height,
    maxHealth,
    speed = 0.002
  ) {
    this.map = map;
    this.sprites = sprites;
    this.currentSprite = 0;
    this.initialPos = initialPos.copy();
    this.pos = initialPos.copy();
    this.jumpForce = new Vector(0, 0);
    this.jumpBlocked = false;
    this.height = height;
    this.width = width;
    this.speed = speed;
    this.direction = "left";
    this.dead = false;
    this.maxHealth = maxHealth;
    this.currentHealth = maxHealth;
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
    const collision = collide(nextPos, this.width, this.height);
    if (collision) {
      this.speed *= -1;

      const leftCollision = collision.subV(this.pos).x < 0;
      if (leftCollision) this.pos.x = collision.x + 1;
      else this.pos.x = collision.x - this.width;
    } else {
      this.pos = nextPos;
    }
  }

  update() {
    if (this.dead) return;

    if (frameCount % 15 === 0) {
      this.currentSprite++;
      if (this.currentSprite >= this.sprites.length) this.currentSprite = 0;
    }
    if (entitiesCollide(this, Game.player)) {
      if (
        this.pos.subV(Game.player.pos).y - Game.player.height > -0.2 &&
        Game.player.jumpForce.y < 0
      ) {
        Game.player.kill(this);
        this.deathSound.play();
      } else {
        Game.player.currentHealth -= 2;
      }
    }

    this.walk(this.speed * deltaTime);

    const nextPos = this.pos.subV(this.jumpForce);
    const collision = collide(nextPos, this.width, this.height);
    if (collision) {
      const headCollision = collision.subV(this.pos).y < 0;

      if (headCollision) {
        this.pos.y = collision.y + 1;
      } else {
        this.pos.y = collision.y - this.height;
        this.jumpBlocked = false;
        if (this.onTouchGround) this.onTouchGround();
      }
      this.jumpForce = new Vector(0, 0);
    } else {
      this.jumpBlocked = true;
      this.jumpForce = this.jumpForce.sub(0, 0.000546875 * deltaTime);
      this.pos = nextPos;
    }
    if (this.currentHealth <= 0) {
      this.dead = true;
      this.deathSound.play();
    }
  }

  draw() {
    if (this.dead) return;

    let x = this.pos.x * SIZE;
    let y = this.pos.y * SIZE;
    let width = SIZE * this.width;
    let height = SIZE * this.height;

    push();
    if (this.direction === "right") {
      scale(-1, 1);
      x = -x - SIZE * this.width;
    }

    image(this.sprites[this.currentSprite], x, y, width, height);
    pop();
    push();
    const healthBarWidth = 150;
    const healthBarHeight = 20;
    fill("#ff0000");
    rect(
      this.pos.x * SIZE - healthBarWidth / 2 + (SIZE * this.width) / 2,
      this.pos.y * SIZE - healthBarHeight,
      healthBarWidth,
      healthBarHeight
    );
    fill("#00ff3e");
    rect(
      this.pos.x * SIZE - healthBarWidth / 2 + (SIZE * this.width) / 2,
      this.pos.y * SIZE - healthBarHeight,
      healthBarWidth * (this.currentHealth / this.maxHealth),
      healthBarHeight
    );
    textAlign(CENTER, CENTER);
    fill("#000");
    text(
      Math.round(this.currentHealth) + " HP",
      this.pos.x * SIZE + (SIZE * this.width) / 2,
      this.pos.y * SIZE - healthBarHeight + healthBarHeight / 2
    );
    pop();
  }
}

export default Monster;
