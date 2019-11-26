import Vector from "./vector";
import Mario from "./mario";
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

export function init(sketch) {
  sk = sketch;
  camera = new Camera(sk);
  map = new GameMap(sk);
  mario = new Mario(sk, map);
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

export function input(deltaTime) {
  switchEditingButton.input();
  saveButton.input();
  if (!editing) mario.input(deltaTime);
  else camera.input(deltaTime);
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
    mario.update(deltaTime);
    centerCamera();
  }
}

export function mouseDown(e) {
  if (editing) {
    const gridX = Math.floor((sk.mouseX - camera.pos.x) / (16 * SCALE));
    const gridY = Math.floor((sk.mouseY - camera.pos.y) / (16 * SCALE));

    if (sk.mouseButton === sk.LEFT) {
      if (sk.keyIsDown(17)) {
        map.set(gridX, gridY, 0);
        e.preventDefault();
      } else {
        map.set(gridX, gridY, 1);
      }
    }
  }
}

export function mouseWheel(e) {
  if (editing) {
    if (sk.keyIsDown(17)) {
      // 17 for CTRL
      camera.move(-e.delta * 10, 0);
      e.preventDefault();
    } else {
      camera.move(0, -e.delta * 10);
    }
  }
}

export function draw() {
  camera.bind();

  sk.background(BG);
  map.draw();
  mario.draw();

  if (editing) {
    const gridX = Math.floor((sk.mouseX - camera.pos.x) / (16 * SCALE));
    const gridY = Math.floor((sk.mouseY - camera.pos.y) / (16 * SCALE));

    sk.fill(0, 0, 0, 0);
    sk.strokeWeight(5);
    sk.strokeJoin(sk.ROUND);
    sk.stroke(127, 63, 120);
    sk.rect(gridX * SIZE, gridY * SIZE, SIZE, SIZE);
  }

  camera.unbind();
  switchEditingButton.draw();
  saveButton.draw();

  // Debug Hilfslinien
  /*
  sk.stroke("#f00");
  sk.line(0, sk.windowHeight / 2, sk.windowWidth, sk.windowHeight / 2);
  sk.line(sk.windowWidth / 2, 0, sk.windowWidth / 2, sk.windowHeight);
  */
}
