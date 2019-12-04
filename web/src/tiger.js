import Monster from "./monster";
import tigerImg from "./assets/tiger.png";

class Tiger extends Monster {
  constructor(map, x, y) {
    super(map, [loadImage(tigerImg)], x, y, 2 / 1.5, 1);
  }
}

export default Tiger;
