import Button from "./button";

export let isInitialized = false;
let maps;
let buttons = [];

export function init() {
  isInitialized = true;

  fetch("/api/map")
    .then(res => res.json())
    .then(newMaps => {
      maps = newMaps;
      maps.forEach((map, i) => {
        buttons.push(
          new Button(
            windowWidth / 2 - 200 / 2,
            i * 60 + 300,
            200,
            50,
            map.name,
            () => switchScreen("game", { mapName: map.name })
          )
        );
      });
    });
}

export function mouseClicked() {}

export function input() {
  buttons.forEach(button => button.input());
}

export function update() {}

export function draw() {
  clear();
  push();
  textAlign(CENTER, CENTER);
  textSize(150);
  text("JuicySoup", windowWidth / 2, 200);
  pop();

  if (maps) {
    buttons.forEach(button => {
      button.draw();
    });
  } else {
    push();
    textSize(75);
    text("Lade...", windowWidth / 2, 500);
    pop();
  }
}
