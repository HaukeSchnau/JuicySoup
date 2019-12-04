let buttons = [];

class Button {
  constructor(x, y, width, height, text, onClick) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.width = width;
    this.height = height;
    this.onClick = onClick;
    this.mouseWasPressed = false;
    buttons.push(this);
  }

  input() {
    if (
      mouseX >= this.x &&
      mouseY >= this.y &&
      mouseX < this.x + this.width &&
      mouseY < this.y + this.height
    ) {
      if (mouseIsPressed && !this.mouseWasPressed) {
        this.onClick();
      }
    }

    this.mouseWasPressed = mouseIsPressed;
  }

  draw() {
    fill("#fff");
    stroke("#000");
    strokeWeight(2);
    rect(this.x, this.y, this.width, this.height, 10);
    noStroke();
    textAlign(CENTER, CENTER);
    fill("#000");
    text(this.text, this.x + 1, this.y + 1, this.width, this.height);
  }
}

export default Button;
