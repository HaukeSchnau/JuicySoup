// Einfache Vektor-Klasse mit X und Y Wert
// Alle Operationen verändern das Objekt nicht, sondern es wird immer ein neuer Vektor zurückgegeben.
class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  copy() {
    return new Vector(this.x, this.y);
  }

  // Berechne Skalarprodukt
  dot(r) {
    return this.x * r.x + this.y * r.y;
  }

  // Berechne Länge des Vektors mit Satz des Pythagoras
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  // Länge des Vektors auf genau 1 setzen
  normalize() {
    const length = this.length();
    return new Vector(this.x / length, this.y / length);
  }

  // Addiere zum Vektor
  // Wenn nur ein Wert gegeben ist, wird dieser sowohl auf x als auch auf y angewandt
  add(x, y) {
    if (typeof y === "undefined") {
      return new Vector(this.x + x, this.y + x);
    } else {
      return new Vector(this.x + x, this.y + y);
    }
  }

  // Addiere einen anderen Vektor zu diesem
  addV(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  // Subtrahiere vom Vektor
  // Wenn nur ein Wert gegeben ist, wird dieser sowohl auf x als auch auf y angewandt
  sub(x, y) {
    if (typeof y === "undefined") {
      return new Vector(this.x - x, this.y - x);
    } else {
      return new Vector(this.x - x, this.y - y);
    }
  }

  // Subtrahiere einen anderen Vektor von diesem
  subV(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  // Dividiere den Vektor
  // Wenn nur ein Wert gegeben ist, wird dieser sowohl auf x als auch auf y angewandt
  div(x, y) {
    if (typeof y === "undefined") {
      return new Vector(this.x / x, this.y / x);
    } else {
      return new Vector(this.x / x, this.y / y);
    }
  }

  // Multipliziere Vektor
  // Wenn nur ein Wert gegeben ist, wird dieser sowohl auf x als auch auf y angewandt
  mul(x, y) {
    if (typeof y === "undefined") {
      return new Vector(this.x * x, this.y * x);
    } else {
      return new Vector(this.x * x, this.y * y);
    }
  }

  // Entferne Nachkommastellen von den Werten
  floor() {
    return new Vector(Math.floor(this.x), Math.floor(this.y));
  }
}

export default Vector;
