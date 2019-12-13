// Das Spiel selbst
// Diese Datei ist ein Screen, der vergleichbar mit mainMenu.js ist

import Player from "./player";
import Camera from "./camera";
import GameMap from "./map";
import Button from "./button";
import { SCALE, SIZE } from "./constants";
import bgMusicPath from "./assets/sheeran.mp3";
import deathMusicPath from "./assets/death.mp3";
import Sound from "./sound";

const BG = "#254152";

// GameObjects haben die Funktionen draw, update und evtl. input
export let gameObjects = [];

export let player;
export let camera;
export let map;

// Bearbeitungsmodus
// TODO Bearbeitungsmodus in eigene Datei?
let editing = false;
let selectedBlock = 1;

let switchEditingButton, saveButton, respawnButton;
let showDeathScreen = false;
export let isInitialized = false;

// Objekte zur Steuerung der Musik. Sie nutzen die Klasse Sound
let bgMusic, deathMusic;

export function setShowDeathScreen(val) {
  showDeathScreen = val;
}

export async function init(mapName) {
  camera = new Camera();
  map = await GameMap.fetchFromName(mapName);
  player = new Player(map);
  gameObjects = [player];
  switchEditingButton = new Button(
    10,
    10,
    200,
    50,
    editing ? "Bearbeitungsmodus verlassen" : "Bearbeitungsmodus betreten",
    () => {
      editing = !editing;
      switchEditingButton.text = editing
        ? "Bearbeitungsmodus verlassen"
        : "Bearbeitungsmodus betreten";
    }
  );
  saveButton = new Button(220, 10, 200, 50, "Karte Speichern", () => {
    fetch(`/api/map/${map.name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ chunks: map.chunks })
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          saveButton.text = "Erfolgreich gespeichert!";
          setTimeout(() => (saveButton.text = "Karte speichern"), 2000);
        }
      });
  });
  respawnButton = new Button(
    windowWidth / 2 - 200 / 2,
    windowHeight / 2,
    200,
    50,
    "Respawn",
    () => {
      showDeathScreen = false;
      player.respawn();
      deathMusic.stop();
      bgMusic.play();
    }
  );
  bgMusic = new Sound(bgMusicPath);
  bgMusic.setLoop(true);
  bgMusic.play();
  bgMusic.setVolume(0.3);
  deathMusic = new Sound(deathMusicPath);
  deathMusic.setLoop(true);
  deathMusic.setVolume(0.25);

  isInitialized = true;
}

// Leiste mit Blöcken im Bearbeitungsmodus
// TODO umbenennen/umstrukturieren
function getBlockBar() {
  const barTiles = map.tiles.slice(1); // Entfernt Luft aus der Liste der Blöcke
  const spacing = 20;
  const blockSpacing = 10;
  const numBlocks = barTiles.length;
  const blockSize = SIZE * 1.5;
  const width = (blockSize + blockSpacing) * numBlocks - blockSpacing;
  const height = blockSize;
  const yOffset = 10;
  const x = windowWidth / 2 - (width + spacing) / 2;
  const y = windowHeight - (height + spacing) - yOffset;
  const realWidth = width + spacing;
  const realHeight = height + spacing;
  return {
    barTiles,
    spacing,
    blockSpacing,
    blockSize,
    width,
    height,
    yOffset,
    x,
    y,
    realWidth,
    realHeight
  };
}

export function input() {
  if (!isInitialized) return;

  switchEditingButton.input();
  saveButton.input();
  if (showDeathScreen) respawnButton.input();
  if (!editing && !showDeathScreen) {
    gameObjects.forEach(obj => obj.input && obj.input());
  } else camera.input();
}

// Zentriert die Kamera auf den Spieler
function centerCamera() {
  camera.set(
    player.pos
      .mul(-SIZE)
      .sub(SIZE / 2, (SIZE * 1.5) / 2 + (player.ducked ? -SIZE * 0.5 : 0))
      .add(windowWidth / 2, windowHeight / 2)
  );
}

export function update() {
  if (!isInitialized) return;

  if (!editing && !showDeathScreen) {
    map.update();
    gameObjects.forEach(obj => obj.update());
    centerCamera();
  }
}

export function mouseDown(e) {
  if (!isInitialized) return;

  if (editing) {
    const blockBar = getBlockBar();

    if (
      !(
        mouseX > blockBar.x &&
        mouseX < blockBar.x + blockBar.realWidth &&
        mouseY > blockBar.y &&
        mouseY < blockBar.y + blockBar.realHeight
      )
    ) {
      const gridX = Math.floor((mouseX - camera.pos.x) / (16 * SCALE));
      const gridY = Math.floor((mouseY - camera.pos.y) / (16 * SCALE));
      if (mouseButton === LEFT) {
        if (keyIsDown(17)) {
          map.set(gridX, gridY, 0);
          e.preventDefault();
        } else {
          map.set(gridX, gridY, selectedBlock);
        }
      }
    } else {
      blockBar.barTiles.forEach((tile, i) => {
        const blockX =
          windowWidth / 2 -
          blockBar.width / 2 +
          i * (blockBar.blockSize + blockBar.blockSpacing);
        const blockY =
          windowHeight -
          blockBar.height -
          blockBar.yOffset -
          blockBar.spacing / 2;
        if (
          mouseX > blockX &&
          mouseY > blockY &&
          mouseX < blockX + blockBar.blockSize &&
          mouseY < blockY + blockBar.blockSize
        ) {
          selectedBlock = i + 1;
        }
      });
    }
  }
}

export function mouseClicked() {
  if (!isInitialized) return;

  if (!editing && !showDeathScreen) {
    gameObjects.forEach(obj => obj.mouseClicked && obj.mouseClicked());
  }
}

export function mouseWheel(e) {
  if (!isInitialized) return;

  if (editing) {
    if (keyIsDown(17)) {
      // 17 for CTRL
      camera.move(-e.delta * 2, 0);
      e.preventDefault();
    } else {
      camera.move(0, -e.delta * 2);
    }
  }
}

export function draw() {
  if (!isInitialized) return;

  background(BG);
  map.drawBackground();
  camera.bind();
  map.draw();
  gameObjects.forEach(obj => {
    push();
    obj.draw();
    pop();
  });

  if (editing) {
    const blockBar = getBlockBar();

    if (
      mouseX > blockBar.x &&
      mouseX < blockBar.x + blockBar.realWidth &&
      mouseY > blockBar.y &&
      mouseY < blockBar.y + blockBar.realHeight
    ) {
    } else {
      push();
      const gridX = Math.floor((mouseX - camera.pos.x) / (16 * SCALE));
      const gridY = Math.floor((mouseY - camera.pos.y) / (16 * SCALE));

      fill(0, 0, 0, 0);
      strokeWeight(5);
      strokeJoin(ROUND);
      stroke(127, 63, 120);
      rect(gridX * SIZE, gridY * SIZE, SIZE, SIZE);
      pop();
    }

    camera.unbind();
    stroke("#000");
    fill("#fff");
    rect(blockBar.x, blockBar.y, blockBar.realWidth, blockBar.realHeight, 20);
    blockBar.barTiles.forEach((tile, i) => {
      image(
        tile,
        windowWidth / 2 -
          blockBar.width / 2 +
          i * (blockBar.blockSize + blockBar.blockSpacing),
        windowHeight -
          blockBar.height -
          blockBar.yOffset -
          blockBar.spacing / 2,
        blockBar.blockSize,
        blockBar.blockSize
      );
      if (i === selectedBlock - 1) {
        push();
        fill("#00000000");
        strokeWeight(5);
        rect(
          windowWidth / 2 -
            blockBar.width / 2 +
            i * (blockBar.blockSize + blockBar.blockSpacing),
          windowHeight -
            blockBar.height -
            blockBar.yOffset -
            blockBar.spacing / 2,
          blockBar.blockSize,
          blockBar.blockSize
        );
        pop();
      }
    });
  }

  camera.unbind();
  switchEditingButton.draw();
  saveButton.draw();
  push();
  textSize(32);
  text("Score: " + player.score, windowWidth / 2, 25);
  pop();

  push();
  textSize(50);
  fill("#fff");
  text(Math.round(frameRate()) + " fps", windowWidth - 100, 50);
  pop();

  if (showDeathScreen) {
    fill(0, 0, 0, 200);
    rect(0, 0, windowWidth, windowHeight);

    push();
    textAlign(CENTER);
    stroke("#000");
    strokeWeight(5);
    fill("#fff");
    textSize(50);
    text("The big sad", windowWidth / 2, windowHeight / 2 - 50);
    pop();
    respawnButton.draw();
    bgMusic.stop();
    deathMusic.play();
  }

  // Debug Hilfslinien
  /*
  stroke("#f00");
  line(0, windowHeight / 2, windowWidth, windowHeight / 2);
  line(windowWidth / 2, 0, windowWidth / 2, windowHeight);
  */
}
