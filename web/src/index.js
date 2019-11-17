import p5 from "p5";
import "./style.css";
import * as Game from "./game";

new p5(sk => {
  sk.preload = () => {
    Game.init(sk);
  };

  sk.mouseWheel = Game.mouseWheel;
  sk.mouseDragged = Game.mouseDown;
  sk.mousePressed = Game.mouseDown;

  sk.setup = () => {
    sk.createCanvas(sk.windowWidth, sk.windowHeight);
    sk.noSmooth();
  };

  sk.draw = () => {
    Game.input(sk.deltaTime);
    Game.update(sk.deltaTime);
    Game.draw();
  };

  sk.windowResized = () => {
    sk.resizeCanvas(sk.windowWidth, sk.windowHeight);
  };
});
