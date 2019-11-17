let buttons = [];

class Button {
  constructor(sk, x, y, width, height, text, onClick) {
    this.sk = sk;
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
      this.sk.mouseX >= this.x &&
      this.sk.mouseY >= this.y &&
      this.sk.mouseX < this.x + this.width &&
      this.sk.mouseY < this.y + this.height
    ) {
      if (this.sk.mouseIsPressed && !this.mouseWasPressed) {
        this.onClick();
      }
    }

    this.mouseWasPressed = this.sk.mouseIsPressed;
  }

  draw() {
    this.sk.fill("#fff");
    this.sk.stroke("#000");
    this.sk.strokeWeight(2);
    this.sk.rect(this.x, this.y, this.width, this.height, 10);
    this.sk.noStroke();
    this.sk.textAlign(this.sk.CENTER, this.sk.CENTER);
    this.sk.fill("#000");
    this.sk.text(this.text, this.x + 1, this.y + 1, this.width, this.height);
  }
}

export default Button;
