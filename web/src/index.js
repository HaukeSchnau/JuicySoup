import p5 from "p5";
import "./style.css";
import * as Game from "./game";
import * as MainMenu from "./mainMenu";

let currentScreen = MainMenu;

// Wechselt zwischen Screens wie z.B. dem Hauptmenü oder dem Spiel selbst.
// Mögliche screenNames sind zur Zeit: mainMenu, game
// "game" nimmt in opts ein Objekt mit dem mapName an.
window.switchScreen = async (screenName, opts) => {
  currentScreen.dispose();
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
  // TODO remove this
  localStorage.setItem("currentScreen", screenName);
  localStorage.setItem("opts", JSON.stringify(opts));
};

window.preload = async () => {
  // TODO remove localStorage
  switchScreen(
    localStorage.getItem("currentScreen") || "mainMenu",
    JSON.parse(localStorage.getItem("opts") || "{}")
  );
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
