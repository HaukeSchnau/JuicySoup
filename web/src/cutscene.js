function easeOutElastic(t, b, c, d) {
  var s = 1.70158;
  var p = 0;
  var a = c;
  if (t == 0) return b;
  if ((t /= d) == 1) return b + c;
  if (!p) p = d * 0.3;
  if (a < Math.abs(c)) {
    a = c;
    var s = p / 4;
  } else var s = (p / (2 * Math.PI)) * Math.asin(c / a);
  return (
    a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) +
    c +
    b
  );
}

import bubbleImg from "./assets/bubble.png";

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
    if (this.totalTime > 2000) this.done = true;
  }

  draw() {
    const imgWidth = 990 / 2;
    const imgHeight = 1320 / 2;
    let t = this.time;
    push();
    translate(easeOutElastic(this.time, -imgHeight, 1000, 1), 300);
    rotate(PI / 8);
    image(this.image, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
    pop();

    push();
    scale(1, -1);
    const bubbleX = windowWidth + 200 - easeOutElastic(this.time, 0, 1200, 1);
    const bubbleY = -800;
    image(this.bubble, bubbleX, bubbleY, 800, 500);
    pop();

    fill("#000");
    textSize(50);
    text("Warum machst du das", bubbleX + 200, 600);
  }
}