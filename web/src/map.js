import ground from "./assets/ground.png";
import ground2 from "./assets/ground2.png";
import rocks from "./assets/rocks.png";
import bg from "./assets/bg1.jpg";
import { SIZE } from "./constants";
import Vector from "./vector";
import Tiger from "./tiger";
import * as Game from "./game";

class GameMap {
  static listMaps() {
    return fetch("/api/map").then(res => res.json());
  }

  static fetchFromName(name) {
    return fetch(`/api/map/${name}`)
      .then(res => res.json())
      .then(
        map =>
          new GameMap(
            map.chunks,
            map.monsters,
            map.spawnPoint,
            map.name,
            map.backgroundImage
          )
      );
  }

  constructor(chunks, monsters, spawnPoint, name, backgroundImage) {
    this.chunks = chunks;
    this.name = name;
    this.spawnPoint = new Vector(spawnPoint.x, spawnPoint.y);
    this.monsters = monsters.map(monster => {
      switch (monster.type) {
        case "tiger":
          return new Tiger(this, monster.x, monster.y);
      }
    });
    this.tiles = [];
    this.tiles[1] = loadImage(ground);
    this.tiles[2] = loadImage(ground2);
    this.tiles[3] = loadImage(rocks);
    this.bg = loadImage(bg);
  }

  get(x, y) {
    const chunkPos = new Vector(x, y).div(16).floor();
    let chunk = this.chunks.find(
      chunk => chunk.x === chunkPos.x && chunk.y === chunkPos.y
    );
    if (!chunk) {
      chunk = { x: chunkPos.x, y: chunkPos.y, data: [] };
      this.chunks.push(chunk);
    }
    const chunkX = x - chunk.x * 16;
    const chunkY = y - chunk.y * 16;
    const index = chunkX + chunkY * 16;
    return chunk.data[index];
  }

  set(x, y, tileId) {
    const chunkPos = new Vector(x, y).div(16).floor();
    let chunk = this.chunks.find(
      chunk => chunk.x === chunkPos.x && chunk.y === chunkPos.y
    );
    if (!chunk) {
      chunk = { x: chunkPos.x, y: chunkPos.y, data: [] };
      this.chunks.push(chunk);
    }
    const chunkX = x - chunk.x * 16;
    const chunkY = y - chunk.y * 16;
    const index = chunkX + chunkY * 16;
    chunk.data[index] = tileId;
  }

  drawBackground() {
    image(this.bg, 0, 0, windowWidth, windowHeight);
  }

  update() {
    this.monsters.forEach(monster => monster.update());
  }

  draw() {
    this.chunks.forEach(chunk => {
      const chunkPos = new Vector(chunk.x, chunk.y).mul(16);
      chunk.data.forEach((tile, i) => {
        if (!tile || tile >= this.tiles.length) return;
        const y = Math.floor(i / 16);
        const x = i - y * 16;
        if (
          (x + chunkPos.x + 1) * SIZE < -Game.camera.pos.x ||
          (y + chunkPos.y + 1) * SIZE < -Game.camera.pos.y ||
          (x + chunkPos.x) * SIZE > -Game.camera.pos.x + windowWidth ||
          (y + chunkPos.y) * SIZE > -Game.camera.pos.y + windowHeight
        )
          return;

        image(
          this.tiles[tile],
          (x + chunkPos.x) * SIZE,
          (y + chunkPos.y) * SIZE,
          SIZE,
          SIZE
        );
      });
    });
    this.monsters.forEach(monster => {
      push();
      monster.draw();
      pop();
    });
  }
}

export default GameMap;
