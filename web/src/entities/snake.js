import Monster from "./monster";
import snakeImg from "../assets/snake.png";
import * as Game from "../game";
import Bullet from "../bullet";

class Snake extends Monster {
  constructor(map, initialPos) {
    super(map, Snake.sprites, initialPos, 1, 1, 20, 0);
    this.type = "snake";
  }

  update() {
    if (this.dead) return;
    super.update();

    const bulletSpeed = 0.3;
    if (frameCount % Math.floor(Math.random() * 50 + 30) === 0)
      Game.gameObjects.push(
        new Bullet(
          this.pos.add(this.width / 2, this.height / 2),
          Game.player.pos
            .subV(this.pos.add(this.width / 2, this.height / 2))
            .normalize()
            .mul(bulletSpeed),
          10
        )
      );
  }
}

Snake.preload = () => {
  Snake.sprites = [loadImage(snakeImg)];
};

export default Snake;
