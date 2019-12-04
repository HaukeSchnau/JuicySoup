import { SCALE, SIZE } from "./constants";
import { map, gameObjects } from "./game";
import { entitiesCollide } from "./physics";

class Bullet {
  constructor(pos, direction, speed) {
    this.pos = pos.copy();
    this.direction = direction;
    this.speed = speed;
    this.distanceTraveled = 0;
    this.dead = false;
    this.width = 0.3;
    this.height = 0.3;
  }

  update() {
    if (this.dead) return;

    this.pos = this.pos.addV(this.direction.mul(this.speed));
    this.distanceTraveled += this.direction.mul(this.speed).length();
    if (this.distanceTraveled > 50) {
      this.dead = true;
    }
    this.direction = this.direction.add(0, 0.005);

    map.monsters.forEach(monster => {
      if (monster.dead) return;

      if (entitiesCollide(this, monster)) {
        monster.dead = true;
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
