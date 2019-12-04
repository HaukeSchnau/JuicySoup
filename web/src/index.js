import p5 from "p5";
import "./style.css";
import * as Game from "./game";

let isInitialized = false;

window.preload = async () => {
  await Game.init(window);
  isInitialized = true;
  window.mouseWheel = Game.mouseWheel;
  window.mouseDragged = Game.mouseDown;
  window.mousePressed = Game.mouseDown;
};

window.setup = () => {
  createCanvas(windowWidth, windowHeight);
  noSmooth();
};

window.draw = () => {
  if (!isInitialized) return;

  Game.input(deltaTime);
  Game.update(deltaTime);
  Game.draw();
};

window.windowResized = () => {
  resizeCanvas(windowWidth, windowHeight);
};

new p5();
