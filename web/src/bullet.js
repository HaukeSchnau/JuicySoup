import { SCALE, SIZE } from "./constants";
import { map, mario } from "./game";
import { entitiesCollide } from "./physics";

class Bullet {
  constructor(pos, direction, speed) {
    this.pos = pos.copy();
    this.velocity = direction.mul(speed);
    this.speed = speed;
    this.distanceTraveled = 0;
    this.dead = false;
    this.width = 0.3;
    this.height = 0.3;
  }

  update() {
    if (this.dead) return;

    this.pos = this.pos.addV(this.velocity);
    this.distanceTraveled += this.velocity.length();
    if (this.distanceTraveled > 50) {
      this.dead = true;
    }
    this.velocity = this.velocity.add(0, 0.001);

    map.monsters.forEach(monster => {
      if (monster.dead) return;

      if (entitiesCollide(this, monster)) {
        mario.kill(monster);
        this.dead = true;
      }
    });
  }

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
