import p5 from "p5";
import "./style.css";
import * as Game from "./game";
import * as MainMenu from "./mainMenu";

let currentScreen = MainMenu;

window.switchScreen = async (screenName, opts) => {
  switch (screenName) {
    case "mainMenu":
      currentScreen = MainMenu;
      await MainMenu.init();
      break;
    case "game":
      currentScreen = Game;
      await Game.init(opts.mapName);
      break;
  }
  window.mouseWheel = currentScreen.mouseWheel;
  window.mouseDragged = currentScreen.mouseDown;
  window.mousePressed = currentScreen.mouseDown;
  window.mouseClicked = currentScreen.mouseClicked;
};

window.preload = async () => {
  switchScreen("mainMenu");
};

window.mouseWheel = () => {};

window.setup = () => {
  createCanvas(windowWidth, windowHeight);
  noSmooth();
};

window.draw = () => {
  if (!currentScreen.isInitialized) return;

  currentScreen.input();
  currentScreen.update();
  currentScreen.draw();
};

window.windowResized = () => {
  resizeCanvas(windowWidth, windowHeight);
};

new p5();
