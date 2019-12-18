import Vector from "./vector";

const SPEED = 0.5;

class Camera {
  constructor() {
    this.pos = new Vector(0, 0);
    this.posOffset = new Vector(0, 0);
    this.isBound = false;
    this.shakeEndFrameCount = -1;
  }

  // Wird im Bearbeitungsmodus genutzt
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

  update() {
    if (this.shakeEndFrameCount > frameCount) {
      if (frameCount % 2 === 0) {
        if (this.posOffset.x === 0) {
          this.posOffset = new Vector(4, 0);
        } else {
          this.posOffset = this.posOffset.mul(-1);
        }
      }
    } else {
      this.posOffset = new Vector();
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

  // Wendet den Kamera-Effekt an.
  // Sollte aufgerufen werden, bevor Spielelemente gezeichnet werden
  bind() {
    if (!this.isBound) {
      // Bewegt das gesamte Spiel, um den Effekt einer Kamera zu erschaffen
      translate(this.pos.x + this.posOffset.x, this.pos.y + this.posOffset.y);
      this.isBound = true;
    }
  }

  // Schaltet Kamera-Effekte aus
  // Sollte aufgerufen werden, bevor HUD gezeichnet wird
  unbind() {
    if (this.isBound) {
      translate(
        -(this.pos.x + this.posOffset.x),
        -(this.pos.y + this.posOffset.y)
      );
      this.isBound = false;
    }
  }

  shake(shakeFrames) {
    this.shakeEndFrameCount = frameCount + shakeFrames;
  }
}

export default Camera;
