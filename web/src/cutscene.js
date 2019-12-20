import bubbleImg from "./assets/bubble.png";
import { easeOutElastic } from "./easing";

// Pausieren das Spiel und lassen einen Charakter sprechen
// Verschwinden nach einem Mausklick
let mouseWasPressed = false;
export default class Curscene {
  constructor(image, text) {
    this.image = image;
    this.text = text;
    this.time = 0;
    this.totalTime = 0;
    this.done = false;
    this.bubble = loadImage(bubbleImg);
  }

  update() {
    if (this.time + deltaTime / 1000 < 1) this.time += deltaTime / 1000;
    else this.time = 1;
    this.totalTime += deltaTime;

    if (mouseIsPressed && !mouseWasPressed) {
      this.done = true;
    }
    mouseWasPressed = mouseIsPressed;
  }

  draw() {
    const imgWidth = 990 / 2;
    const imgHeight = 1320 / 2;
    // Das Bild
    push();
    translate(easeOutElastic(this.time, -imgHeight, 1000, 1), 300);
    rotate(PI / 8);
    image(this.image, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
    pop();

    // Die Sprechblase
    push();
    scale(1, -1);
    const bubbleX = windowWidth + 200 - easeOutElastic(this.time, 0, 1200, 1);
    const bubbleY = -800;
    image(this.bubble, bubbleX, bubbleY, 800, 500);
    pop();

    // Der Text in der Sprechblase
    fill("#000");
    textSize(20);
    textAlign(LEFT, TOP);
    text(this.text, bubbleX + 150, 500, 600, 600 + 500);
  }
}
