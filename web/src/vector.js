class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  copy() {
    return new Vector(this.x, this.y);
  }

  add(x, y) {
    if (typeof y === "undefined") {
      return new Vector(this.x + x, this.y + x);
    } else {
      return new Vector(this.x + x, this.y + y);
    }
  }

  addV(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  sub(x, y) {
    if (typeof y === "undefined") {
      return new Vector(this.x - x, this.y - x);
    } else {
      return new Vector(this.x - x, this.y - y);
    }
  }

  subV(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  div(x, y) {
    if (typeof y === "undefined") {
      return new Vector(this.x / x, this.y / x);
    } else {
      return new Vector(this.x / x, this.y / y);
    }
  }

  mul(x, y) {
    if (typeof y === "undefined") {
      return new Vector(this.x * x, this.y * x);
    } else {
      return new Vector(this.x * x, this.y * y);
    }
  }

  floor() {
    return new Vector(Math.floor(this.x), Math.floor(this.y));
  }
}

export default Vector;
