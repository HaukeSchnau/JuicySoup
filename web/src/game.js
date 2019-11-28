import Mario from "./mario";
import Monster from "./monster";
import Camera from "./camera";
import GameMap from "./map";
import Button from "./button";
import { SCALE, SIZE } from "./constants";

const BG = "#254152";
let gameObjects = [];
let sk;
let mario;
let camera;
let map;
let editing = false;
let switchEditingButton, saveButton;
let selectedBlock = 1;

export function init(sketch) {
  sk = sketch;
  camera = new Camera(sk);
  map = new GameMap(sk);
  mario = new Mario(sk, map);
  gameObjects = [mario, new Monster(sk, map)];
  switchEditingButton = new Button(
    sk,
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
  saveButton = new Button(sk, 220, 10, 200, 50, "Karte Speichern", () => {
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
  const x = sk.windowWidth / 2 - (width + spacing) / 2;
  const y = sk.windowHeight - (height + spacing) - yOffset;
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
  if (!editing) {
    gameObjects.forEach(obj => obj.input && obj.input(deltaTime));
  } else camera.input(deltaTime);
}

function centerCamera() {
  camera.set(
    mario.pos
      .mul(-SIZE)
      .sub(SIZE / 2, (SIZE * 1.5) / 2 + (mario.ducked ? -SIZE * 0.5 : 0))
      .add(sk.windowWidth / 2, sk.windowHeight / 2)
  );
}

export function update(deltaTime) {
  if (!editing) {
    gameObjects.forEach(obj => obj.update(deltaTime));
    centerCamera();
  }
}

export function mouseDown(e) {
  if (editing) {
    const blockBar = getBlockBar();

    if (
      !(
        sk.mouseX > blockBar.x &&
        sk.mouseX < blockBar.x + blockBar.realWidth &&
        sk.mouseY > blockBar.y &&
        sk.mouseY < blockBar.y + blockBar.realHeight
      )
    ) {
      const gridX = Math.floor((sk.mouseX - camera.pos.x) / (16 * SCALE));
      const gridY = Math.floor((sk.mouseY - camera.pos.y) / (16 * SCALE));
      if (sk.mouseButton === sk.LEFT) {
        if (sk.keyIsDown(17)) {
          map.set(gridX, gridY, 0);
          e.preventDefault();
        } else {
          map.set(gridX, gridY, selectedBlock);
        }
      }
    } else {
      blockBar.barTiles.forEach((tile, i) => {
        const blockX =
          sk.windowWidth / 2 -
          blockBar.width / 2 +
          i * (blockBar.blockSize + blockBar.blockSpacing);
        const blockY =
          sk.windowHeight -
          blockBar.height -
          blockBar.yOffset -
          blockBar.spacing / 2;
        if (
          sk.mouseX > blockX &&
          sk.mouseY > blockY &&
          sk.mouseX < blockX + blockBar.blockSize &&
          sk.mouseY < blockY + blockBar.blockSize
        ) {
          selectedBlock = i + 1;
        }
      });
    }
  }
}

export function mouseWheel(e) {
  if (editing) {
    if (sk.keyIsDown(17)) {
      // 17 for CTRL
      camera.move(-e.delta * 2, 0);
      e.preventDefault();
    } else {
      camera.move(0, -e.delta * 2);
    }
  }
}

export function draw() {
  camera.bind();

  sk.background(BG);
  map.draw();
  gameObjects.forEach(obj => {
    sk.push();
    obj.draw();
    sk.pop();
  });

  if (editing) {
    const blockBar = getBlockBar();

    if (
      sk.mouseX > blockBar.x &&
      sk.mouseX < blockBar.x + blockBar.realWidth &&
      sk.mouseY > blockBar.y &&
      sk.mouseY < blockBar.y + blockBar.realHeight
    ) {
    } else {
      sk.push();
      const gridX = Math.floor((sk.mouseX - camera.pos.x) / (16 * SCALE));
      const gridY = Math.floor((sk.mouseY - camera.pos.y) / (16 * SCALE));

      sk.fill(0, 0, 0, 0);
      sk.strokeWeight(5);
      sk.strokeJoin(sk.ROUND);
      sk.stroke(127, 63, 120);
      sk.rect(gridX * SIZE, gridY * SIZE, SIZE, SIZE);
      sk.pop();
    }

    camera.unbind();
    sk.stroke("#000");
    sk.fill("#fff");
    sk.rect(
      blockBar.x,
      blockBar.y,
      blockBar.realWidth,
      blockBar.realHeight,
      20
    );
    blockBar.barTiles.forEach((tile, i) => {
      sk.image(
        tile,
        sk.windowWidth / 2 -
          blockBar.width / 2 +
          i * (blockBar.blockSize + blockBar.blockSpacing),
        sk.windowHeight -
          blockBar.height -
          blockBar.yOffset -
          blockBar.spacing / 2,
        blockBar.blockSize,
        blockBar.blockSize
      );
      if (i === selectedBlock - 1) {
        sk.fill("#00000000");
        sk.strokeWeight(5);
        sk.rect(
          sk.windowWidth / 2 -
            blockBar.width / 2 +
            i * (blockBar.blockSize + blockBar.blockSpacing),
          sk.windowHeight -
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

  sk.push();
  sk.textSize(50);
  sk.fill("#fff");
  sk.text(Math.round(sk.frameRate()) + " fps", sk.windowWidth - 100, 50);
  sk.pop();

  // Debug Hilfslinien
  /*
  sk.stroke("#f00");
  sk.line(0, sk.windowHeight / 2, sk.windowWidth, sk.windowHeight / 2);
  sk.line(sk.windowWidth / 2, 0, sk.windowWidth / 2, sk.windowHeight);
  */
}
