import gunImg from "../assets/gun.png";
import * as Game from "../game";
import Vector from "../vector";
import { SIZE } from "../constants";
import Bullet from "../bullet";

class Gun {
  constructor() {
    this.sprites = Gun.sprites;
    this.type = "gun";
    this.usesLeft = 30;
    // Dadurch wird die Waffe nicht aus der Hotbar entfernt, wenn sie keine Munition mehr hat.
    this.unremovable = true;
  }

  use() {
    const player = Game.player;
    const bulletSpeed = 0.3;
    Game.gameObjects.push(
      new Bullet(
        player.pos.add(player.width / 2, player.height / 2),
        new Vector(mouseX, mouseY)
          .subV(Game.camera.pos)
          .div(SIZE)
          .subV(player.pos.add(player.width / 2, player.height / 2))
          .normalize()
          .mul(bulletSpeed),
        50
      )
    );
  }

  get hotbarSprite() {
    return this.sprites[0];
  }
}

Gun.preload = () => {
  Gun.sprites = [loadImage(gunImg)];
};

export default Gun;
