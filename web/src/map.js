import grass from "./assets/ground.png";
import dirt from "./assets/ground2.png";
import rocks from "./assets/rocks.png";
import desert from "./assets/desert.png";
import coal from "./assets/coal.png";
import steinzeitBg from "./assets/steinzeit-bg.jpg";
import desertBg from "./assets/desert-bg.png";
import { SIZE } from "./constants";
import Vector from "./vector";
import * as Game from "./game";
import Tiger from "./entities/tiger";
import Mammut from "./entities/mammut";
import Snake from "./entities/snake";
import Chest from "./entities/chest";
import bgMusicPath from "./assets/sheeran.mp3";
import bgMusicDesertPath from "./assets/desertBg.mp3";
import Sound from "./sound";

const allSprites = {
  grass: grass,
  dirt: dirt,
  rocks: rocks,
  desert: desert,
  coal: coal
};

const allEntities = {
  tiger: Tiger,
  mammut: Mammut,
  snake: Snake,
  chest: Chest
};

const allBackgrounds = {
  steinzeit: steinzeitBg,
  desert: desertBg
};

const allMusic = {
  steinzeit: bgMusicPath,
  desert: bgMusicDesertPath
};

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
            map.entities,
            map.spawnPoint,
            map.name,
            map.background,
            map.sprites,
            map.availableEntities,
            map.music
          )
      );
  }

  constructor(
    chunks,
    entities,
    spawnPoint,
    name,
    background,
    sprites,
    availableEntities,
    music
  ) {
    this.chunks = chunks;
    this.name = name;
    this.spawnPoint = new Vector(spawnPoint.x, spawnPoint.y);
    this.availableEntities = availableEntities;
    this.availableEntities.forEach(m => {
      allEntities[m].preload();
    });
    this.entities = entities.map(entity => {
      return new allEntities[entity.type](this, new Vector(entity.x, entity.y));
    });
    this.tiles = [];
    sprites.forEach((name, i) => {
      this.tiles[i + 1] = loadImage(allSprites[name]);
    });
    this.bg = loadImage(allBackgrounds[background]);
    this.bgMusic = new Sound(allMusic[music]);
    this.bgMusic.setLoop(true);
    this.bgMusic.play();
    this.bgMusic.setVolume(0.1);
  }

  getEntity(type) {
    return allEntities[type];
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
    let bgWidth = (this.bg.width / this.bg.height) * windowHeight;
    bgWidth = Math.max(bgWidth, windowWidth);
    image(
      this.bg,
      0, //Game.camera.pos.x * 0.1 - 128,
      0,
      bgWidth,
      windowHeight
    );
  }

  update() {
    this.entities.forEach(entity => {
      if (
        (entity.pos.x + entity.width) * SIZE < -Game.camera.pos.x ||
        (entity.pos.y + entity.height) * SIZE < -Game.camera.pos.y ||
        entity.pos.x * SIZE > -Game.camera.pos.x + windowWidth ||
        entity.pos.y * SIZE > -Game.camera.pos.y + windowHeight
      )
        return;

      entity.update();
    });
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
    this.entities.forEach(entity => {
      if (
        (entity.pos.x + entity.width) * SIZE < -Game.camera.pos.x ||
        (entity.pos.y + entity.height) * SIZE < -Game.camera.pos.y ||
        entity.pos.x * SIZE > -Game.camera.pos.x + windowWidth ||
        entity.pos.y * SIZE > -Game.camera.pos.y + windowHeight
      )
        return;
      push();
      entity.draw();
      pop();
    });
  }
}

export default GameMap;
