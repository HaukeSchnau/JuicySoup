import Vector from "./vector";

const SPEED = 0.5;

class Camera {
  constructor() {
    this.pos = new Vector(0, 0);
    this.isBound = false;
  }

  input() {
    if (keyIsDown(37)) {
      // ARROW_LEFT
      this.move(SPEED * deltaTime, 0);
    }
    if (keyIsDown(39)) {
      // ARROW_RIGHT
      this.move(-SPEED * deltaTime, 0);
    }
    if (keyIsDown(38)) {
      // ARROW_UP
      this.move(0, SPEED * deltaTime);
    }
    if (keyIsDown(40)) {
      // ARROW_DOWN
      this.move(0, -SPEED * deltaTime);
    }
  }

  move(x, y) {
    if (x instanceof Vector) {
      this.pos = this.pos.addV(x);
    } else {
      this.pos = this.pos.add(x, y);
    }
  }

  set(x, y) {
    if (x instanceof Vector) {
      this.pos = x.copy();
    } else {
      this.pos = new Vector(x, y);
    }
  }

  bind() {
    if (!this.isBound) {
      translate(this.pos.x, this.pos.y);
      this.isBound = true;
    }
  }

  unbind() {
    if (this.isBound) {
      translate(-this.pos.x, -this.pos.y);
      this.isBound = false;
    }
  }
}

export default Camera;
