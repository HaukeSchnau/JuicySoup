import Monster from "./monster";
import tigerImg from "../../assets/tiger.png";

class Tiger extends Monster {
  constructor(map, initialPos) {
    super(map, Tiger.sprites, initialPos, 2 / 1.5, 1, 50);
    this.type = "tiger";
  }
}

Tiger.preload = () => {
  Tiger.sprites = [loadImage(tigerImg)];
};

export default Tiger;
