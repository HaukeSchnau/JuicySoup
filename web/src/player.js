import Vector from "./vector";
import sprite1 from "./assets/char1.png";
import sprite2 from "./assets/char2.png";
import { collide } from "./physics";
import { SIZE } from "./constants";
import * as Game from "./game";
import Bullet from "./bullet";
import Gun from "./entities/gun";
import Hotbar from "./hotbar";

const NORMAL_HEIGHT = 1.4;
const DUCKED_HEIGHT = 1;

class Player {
  constructor(map) {
    this.map = map;
    Gun.preload();
    this.sprites = [loadImage(sprite1), loadImage(sprite2)];
    this.currentSprite = 0;
    this.pos = Game.map.spawnPoint.copy();
    // Vektor, der die Jump- bzw. Fallkraft angibt. Es hätte wahrscheinlich mehr Sinn gemacht, einfach eine Zahl dafür zu verwenden, da nur die y-Komponente des Vektors genutzt wird.
    this.jumpForce = new Vector(0, 0);
    this.jumpBlocked = false;
    this.ducked = false;
    this.direction = "right";
    this.maxHealth = 100;
    this.currentHealth = this.maxHealth;
    this.score = 0;
    // Sperrt die Steuerung
    this.isControllable = true;
    // Leiste mit Gegenständen
    this.hotbar = new Hotbar(e => e.hotbarSprite);
    this.hotbar.items = [new Gun()];
    this.mouseWasPressed = false;
  }

  get width() {
    return 1;
  }

  get height() {
    return this.ducked ? DUCKED_HEIGHT : NORMAL_HEIGHT;
  }

  get speed() {
    return this.ducked ? 0.005 : 0.009;
  }

  kill(entity) {
    this.score += 10;
    entity.dead = true;
  }

  input() {
    if (!this.isControllable) return;

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
      // SHIFT
      if (!this.ducked) this.pos = this.pos.add(0, NORMAL_HEIGHT - DUCKED_HEIGHT);
      this.ducked = true;
    } else {
      // verhindert, dass der Spieler in einen Block über ihm glitcht.
      if (this.ducked) {
        const nextPos = this.pos.sub(0, NORMAL_HEIGHT - DUCKED_HEIGHT);
        const collision = collide(nextPos, this.width, this.height);
        if (!collision) {
          this.ducked = false;
        }
      }
    }

    // Item benutzen
    if (mouseIsPressed && !this.mouseWasPressed) {
      if (this.hotbar.selectedItem ? this.hotbar.selectedItem.usesLeft : 0 > 0) {
        this.hotbar.selectedItem.usesLeft--;
        this.hotbar.selectedItem.use();
        if (this.hotbar.selectedItem.usesLeft <= 0 && !this.hotbar.selectedItem.unremovable) {
          this.hotbar.items = this.hotbar.items.filter(e => e !== this.hotbar.selectedItem);
        }
      }
    }

    this.mouseWasPressed = mouseIsPressed;
  }

  update() {
    if (this.currentHealth <= 0) {
      this.currentHealth = true;
      Game.setShowDeathScreen(true);
    }

    // Setzt Laufanimation fort
    if (frameCount % 15 === 0) {
      this.currentSprite++;
      if (this.currentSprite >= this.sprites.length) this.currentSprite = 0;
    }

    // Schwerkraft und Kollisionserkennung mit Boden
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
      this.jumpForce = this.jumpForce.sub(0, 0.000546875 * 16);
      this.pos = nextPos;
    }

    // Tötet Spieler, wenn er zu tief fällt.
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
    // Spiegelt Sprite von Spieler je nach Laufrichtung
    if (this.direction === "left") {
      scale(-1, 1);
      x = -x - SIZE;
    }

    // Zeichnet Spieler
    image(this.sprites[this.currentSprite], x, y, width, height);
    pop();

    //Lebensleiste
    push();
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
    pop();
  }
}

export default Player;
