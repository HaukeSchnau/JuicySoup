import { SIZE } from "./constants";
import { easeInCubic } from "./easing";

// Fliegender Text, der nach einiger Zeit verschwindet.
// Wird beim Öffnen von Kisten verwendet
class FloatingText {
  constructor(text, initialPos, maxTime) {
    this.text = text;
    this.pos = initialPos.copy();
    this.maxTime = maxTime;
    this.time = 0;
    this.dead = false;
  }

  update() {
    this.pos = this.pos.sub(0, 0.001 * deltaTime);
    this.time += 0.001 * deltaTime;
    if (this.time >= this.maxTime) {
      this.dead = true;
    }
  }

  draw() {
    push();
    textSize(25);
    textAlign(CENTER);
    const alpha = easeInCubic(this.time, 255, -255, this.maxTime);
    fill(color(255, alpha));
    stroke(color(0, alpha));
    text(this.text, this.pos.x * SIZE, this.pos.y * SIZE);
    pop();
  }
}

export default FloatingText;
