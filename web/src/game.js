import Mario from "./mario";
import Tiger from "./tiger";
import Camera from "./camera";
import GameMap from "./map";
import Button from "./button";
import { SCALE, SIZE } from "./constants";
import bgMusicPath from "./assets/sheeran.mp3";
import deathMusicPath from "./assets/death.mp3";
import Sound from "./sound";

const BG = "#254152";
let gameObjects = [];
export let mario;
export let camera;
let map;
let editing = false;
let switchEditingButton, saveButton, respawnButton;
let selectedBlock = 1;
let showDeathScreen = false;
let bgMusic, deathMusic;

export function setShowDeathScreen(val) {
  showDeathScreen = val;
}

export async function init() {
  camera = new Camera();
  map = await GameMap.fetchFromName("TestMap");
  mario = new Mario(map);
  gameObjects = [mario];
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
    fetch("/api/map", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(map.chunks)
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
      setShowDeathScreen(false);
      mario.respawn();
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
  deathMusic.setVolume(0.3);
}

function getBlockBar() {
  const barTiles = map.tiles.slice(1); // Luft ist kein Block
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

export function input(deltaTime) {
  switchEditingButton.input();
  saveButton.input();
  if (showDeathScreen) respawnButton.input();
  if (!editing && !showDeathScreen) {
    gameObjects.forEach(obj => obj.input && obj.input(deltaTime));
  } else camera.input(deltaTime);
}

function centerCamera() {
  camera.set(
    mario.pos
      .mul(-SIZE)
      .sub(SIZE / 2, (SIZE * 1.5) / 2 + (mario.ducked ? -SIZE * 0.5 : 0))
      .add(windowWidth / 2, windowHeight / 2)
  );
}

export function update(deltaTime) {
  if (!editing && !showDeathScreen) {
    map.update(deltaTime);
    gameObjects.forEach(obj => obj.update(deltaTime));
    centerCamera();
  }
}

export function mouseDown(e) {
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

export function mouseWheel(e) {
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
      }
    });
  }

  camera.unbind();
  switchEditingButton.draw();
  saveButton.draw();
  push();
  textSize(32);
  text("Score: " + mario.score, windowWidth / 2, 25);
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
    text("bruh moment", windowWidth / 2, windowHeight / 2 - 50);
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
