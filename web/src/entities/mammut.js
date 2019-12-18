import Monster from "./monster";
import mammutImg from "../assets/mammut.png";
import Vector from "../vector";
import * as Game from "../game";

class Mammut extends Monster {
  constructor(map, initialPos) {
    super(map, Mammut.sprites, initialPos, 54 / 10, 35 / 10, 5000);
    this.type = "mammut";
    this.attacking = false;
    this.isParalyzed = false;
    this.attackEndTime = -1;
  }

  update() {
    super.update();
    if (frameCount % 200 === 0) {
      this.attack();
    }
    if (this.paralyzeEndTime < frameCount && this.isParalyzed) {
      Game.player.isControllable = true;
      console.log("KNASDF");
      this.isParalyzed = false;
    }
  }

  onTouchGround() {
    if (this.attacking) {
      const duration = 60;
      Game.camera.shake(duration);
      Game.player.isControllable = false;
      this.attacking = false;
      this.paralyzeEndTime = frameCount + duration;
      this.isParalyzed = true;
    }
  }

  attack() {
    this.jumpForce = new Vector(0, 0.3);
    this.attacking = true;
  }
}

Mammut.preload = () => {
  Mammut.sprites = [loadImage(mammutImg)];
};

export default Mammut;
