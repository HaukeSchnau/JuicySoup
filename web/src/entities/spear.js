import spearImg from "../assets/spear.png";
import spearHotbarImg from "../assets/spearHotbar.png";
import Entity from "./entity";
import * as Game from "../game";
import Vector from "../vector";
import { SIZE } from "../constants";
import { rotatedCollide, rotatedCollideRect } from "../physics";

// Speer
class Spear extends Entity {
  constructor(map, initialPos, opts) {
    super(map, Spear.sprites, initialPos, 677 / 300, 119 / 300);
    this.type = "spear";
    this.noPhysics = opts.noPhysics;
    this.usesLeft = 0;
    this.velocity = new Vector();
    // Rotation
    this.rot = opts.rot || 0;
    this.hasTouchedGround = false;
    this.damage = 2000;
  }

  // Die tatsächliche Breite nach Anwendung der Rotation
  get realWidth() {
    const rotRad = this.rot * (Math.PI / 180);
    const rotMatrix = [
      [Math.cos(rotRad), -Math.sin(rotRad)],
      [Math.sin(rotRad), Math.cos(rotRad)]
    ];

    const poly = [
      new Vector(-this.width / 2, -this.height / 2),
      new Vector(this.width / 2, -this.height / 2),
      new Vector(this.width / 2, this.height / 2),
      new Vector(-this.width / 2, this.height / 2)
    ];

    const newPoly = poly.map(p =>
      new Vector(
        p.x * rotMatrix[0][0] + p.y * rotMatrix[0][1],
        p.x * rotMatrix[1][0] + p.y * rotMatrix[1][1]
      ).add(this.pos.x + this.width / 2, this.pos.y + this.height / 2)
    );
    let minX = Infinity;
    let maxX = -Infinity;
    newPoly.forEach(p => {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
    });
    return maxX - minX;
  }

  // Die tatsächliche Höhe nach Anwendung der Rotation
  get realHeight() {
    const rotRad = this.rot * (Math.PI / 180);
    const rotMatrix = [
      [Math.cos(rotRad), -Math.sin(rotRad)],
      [Math.sin(rotRad), Math.cos(rotRad)]
    ];

    const poly = [
      new Vector(-this.width / 2, -this.height / 2),
      new Vector(this.width / 2, -this.height / 2),
      new Vector(this.width / 2, this.height / 2),
      new Vector(-this.width / 2, this.height / 2)
    ];

    const newPoly = poly.map(p =>
      new Vector(
        p.x * rotMatrix[0][0] + p.y * rotMatrix[0][1],
        p.x * rotMatrix[1][0] + p.y * rotMatrix[1][1]
      ).add(this.pos.x + this.width / 2, this.pos.y + this.height / 2)
    );
    let minY = Infinity;
    let maxY = -Infinity;
    newPoly.forEach(p => {
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });
    return maxY - minY;
  }

  update() {
    if (this.dead) return;

    if (!this.noPhysics) {
      if (this.hasTouchedGround)
        this.rot =
          (this.velocity.x > 0 ? 180 : 0) + this.velocity.y * 100 * Math.sign(this.velocity.x);
      const nextPos = this.pos.addV(this.velocity);
      const collision = rotatedCollide(nextPos, this.width, this.height, this.rot);
      if (collision) {
        const headCollision = collision.subV(this.pos).y < 0;

        if (headCollision) {
          this.pos.y = collision.y + 1;
        } else {
          this.pos.y = collision.y - this.realHeight / 2;
          this.jumpBlocked = false;
          this.hasTouchedGround = true;
        }
        this.velocity = new Vector(0, 0);
        this.noPhysics = true;
      } else {
        this.jumpBlocked = true;
        this.velocity = this.velocity.add(0, 0.000546875 * deltaTime);
        this.pos = nextPos;
      }
      this.distanceTraveled += this.velocity.length();
    } else {
      if (
        rotatedCollideRect(
          this.pos,
          this.width,
          this.height,
          this.rot,
          Game.player.pos.x,
          Game.player.pos.y,
          Game.player.width,
          Game.player.height
        )
      ) {
        Game.player.hotbar.items.push(this);
        this.distanceTraveled = 0;
        this.hasTouchedGround = true;
        Game.map.entities = Game.map.entities.filter(e => e !== this);
        this.usesLeft = 1;
      }
    }

    Game.map.entities.forEach(entity => {
      if (entity.dead) return;
      if (entity === this) return;

      if (
        rotatedCollideRect(
          this.pos,
          this.width,
          this.height,
          this.rot,
          entity.pos.x,
          entity.pos.y,
          entity.width,
          entity.height
        )
      ) {
        entity.currentHealth -= this.damage;
        if (entity.currentHealth <= 0) Game.player.score += 10;
        this.dead = true;
      }
    });
  }

  use() {
    Game.map.entities.push(this);
    const bulletSpeed = 0.3;
    const player = Game.player;
    this.noPhysics = false;
    this.pos = player.pos.add(player.width / 2, player.height / 2);
    this.velocity = new Vector(mouseX, mouseY)
      .subV(Game.camera.pos)
      .div(SIZE)
      .subV(player.pos.add(player.width / 2, player.height / 2))
      .normalize()
      .mul(bulletSpeed);
  }

  // Das Sprite, das in der Hotbar angezeigt werden soll.
  // Würde das normale Sprite verwendet werden, würde es sehr verzerrt aussehen
  get hotbarSprite() {
    return this.sprites[1];
  }

  draw() {
    push();
    if (this.dead) return;

    let x = this.pos.x * SIZE;
    let y = this.pos.y * SIZE;
    let width = SIZE * this.width;
    let height = SIZE * this.height;

    // Hier wird translate genutzt, anstatt die Koordinaten in image() anzugeben
    // Dadurch ist der Ankerpunkt für die Rotation zentriert.
    translate(x + width / 2, y + height / 2);
    angleMode(DEGREES);
    rotate(this.rot);
    image(this.sprites[this.currentSprite], -width / 2, -height / 2, width, height);
    pop();
  }
}

Spear.preload = () => {
  Spear.sprites = [loadImage(spearImg), loadImage(spearHotbarImg)];
};

export default Spear;
