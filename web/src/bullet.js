import { SIZE } from "./constants";
import { map, player } from "./game";
import { entitiesCollide } from "./physics";

// Klasse für Projektile, die vom Charakter geschossen werden können
// pos: Vector
// velocity: Vector
class Bullet {
  constructor(pos, velocity) {
    this.pos = pos.copy();
    this.velocity = velocity.copy();
    this.distanceTraveled = 0;
    this.dead = false;
    this.width = 0.3;
    this.height = 0.3;
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
    // Schwerkraft
    this.velocity = this.velocity.add(0, 0.001);

    // Kollisionserkennung mit jedem Monster auf der Map
    map.monsters.forEach(monster => {
      if (monster.dead) return;

      if (entitiesCollide(this, monster)) {
        player.kill(monster);
        this.dead = true;
      }
    });
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
