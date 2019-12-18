import chestImg from "../assets/chest.png";
import chestImgOpen from "../assets/chest_open.png";
import Entity from "./entity";
import { entitiesCollide } from "../physics";
import * as Game from "../game";
import FloatingText from "../floatingText";

class Chest extends Entity {
  constructor(map, initialPos) {
    super(map, Chest.sprites, initialPos, 18 / 15, 20 / 15, 50);
    this.type = "chest";
    this.open = false;
  }

  update() {
    super.update();
    if (entitiesCollide(this, Game.player) && !this.open) {
      this.open = true;
      this.currentSprite = 1;
      Game.player.ammo += 20;
      Game.gameObjects.push(
        new FloatingText("+20 ammo", this.pos.add(this.width / 2, -0.2), 2)
      );
    }
  }
}

Chest.preload = () => {
  Chest.sprites = [loadImage(chestImg), loadImage(chestImgOpen)];
};

export default Chest;
