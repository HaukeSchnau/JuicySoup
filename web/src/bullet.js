import { SIZE } from "./constants";
import { map, player } from "./game";
import { entitiesCollide, collide } from "./physics";
import * as Game from "./game";

// Klasse für Projektile, die vom Charakter geschossen werden können
// pos: Vector
// velocity: Vector
class Bullet {
  constructor(pos, velocity, damage) {
    this.pos = pos.copy();
    this.velocity = velocity.copy();
    this.distanceTraveled = 0;
    this.dead = false;
    this.width = 0.3;
    this.height = 0.3;
    this.damage = damage;
  }

  // Wird jeden Frame von game.js aufgerufen
  update() {
    if (this.dead) return;

    this.pos = this.pos.addV(this.velocity);
    // Entferne Projektil, wenn es zu lang fliegt, um Performance zu sparen
    this.distanceTraveled += this.velocity.length();
    if (this.distanceTraveled > 50) {
      this.dead = true;
    }

    if (
      collide(
        this.pos.sub(this.width / 2, this.height / 2),
        this.width,
        this.height
      )
    )
      this.dead = true;

    // Schwerkraft
    this.velocity = this.velocity.add(0, 0.0001);

    // Kollisionserkennung mit jedem Entity auf der Map
    if (this.distanceTraveled > 2) {
      map.entities.concat([Game.player]).forEach(entity => {
        if (entity.dead) return;

        if (entitiesCollide(this, entity)) {
          entity.currentHealth -= this.damage;
          if (entity.currentHealth <= 0) Game.player.score += 10;
          this.dead = true;
        }
      });
    }
  }

  // Wird jeden Frame von game.js aufgerufen
  draw() {
    if (this.dead) return;

    push();
    ellipse(
      this.pos.x * SIZE,
      this.pos.y * SIZE,
      this.width * SIZE,
      this.height * SIZE
    );
    pop();
  }
}

export default Bullet;
