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
import Tiger from "./entities/monsters/tiger";
import Mammut from "./entities/monsters/mammut";
import Snake from "./entities/monsters/snake";
import Fred from "./entities/npcs/fred";
import Chest from "./entities/chest";
import bgMusicPath from "./assets/sheeran.mp3";
import bgMusicDesertPath from "./assets/desertBg.mp3";
import medievalMusicPath from "./assets/medieval.mp3";
import Sound from "./sound";
import Spear from "./entities/spear";
import wood from "./assets/wood.png";
import medieval1 from "./assets/medieval1.png";
import medieval2 from "./assets/medieval2.png";
import medieval3 from "./assets/medieval3.png";
import medieval4 from "./assets/medieval4.png";
import medievalBg from "./assets/medieval.jpg";

const allSprites = {
  grass: grass,
  dirt: dirt,
  rocks: rocks,
  desert: desert,
  coal: coal,
  wood,
  medieval1,
  medieval2,
  medieval3,
  medieval4
};

const allEntities = {
  tiger: Tiger,
  mammut: Mammut,
  snake: Snake,
  chest: Chest,
  spear: Spear,
  fred: Fred
};

const allBackgrounds = {
  steinzeit: steinzeitBg,
  desert: desertBg,
  medieval: medievalBg
};

const allMusic = {
  steinzeit: bgMusicPath,
  desert: bgMusicDesertPath,
  medieval: medievalMusicPath
};

class GameMap {
  // Holt Liste der Maps vom Server
  static listMaps() {
    return fetch("/api/map").then(res => res.json());
  }

  // Holt Map vom Server und erstellt ein neues Map Objekt
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

  constructor(chunks, entities, spawnPoint, name, background, sprites, availableEntities, music) {
    this.chunks = chunks;
    this.name = name;
    this.spawnPoint = new Vector(spawnPoint.x, spawnPoint.y);
    this.availableEntities = availableEntities;
    // Lade alle Sprites für potentielle Entities in dieser Map, um spätere Ladezeiten zu vermeiden
    this.availableEntities.forEach(m => {
      allEntities[m].preload();
    });
    this.entities = entities.map(entity => {
      const { type, x, y, ...rest } = entity;
      return new allEntities[type](this, new Vector(x, y), rest);
    });
    this.tiles = [];
    // Lädt die Kacheln
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

  // Gibt den Block als Integer an den gegebenen Koordinaten zurück
  get(x, y) {
    const chunkPos = new Vector(x, y).div(16).floor();
    let chunk = this.chunks.find(chunk => chunk.x === chunkPos.x && chunk.y === chunkPos.y);
    if (!chunk) {
      chunk = { x: chunkPos.x, y: chunkPos.y, data: [] };
      this.chunks.push(chunk);
    }
    const chunkX = x - chunk.x * 16;
    const chunkY = y - chunk.y * 16;
    const index = chunkX + chunkY * 16;
    return chunk.data[index];
  }

  // Setzt den Block an den gegebenen Koordinaten. tileId ist ein Integer.
  set(x, y, tileId) {
    const chunkPos = new Vector(x, y).div(16).floor();
    let chunk = this.chunks.find(chunk => chunk.x === chunkPos.x && chunk.y === chunkPos.y);
    if (!chunk) {
      chunk = { x: chunkPos.x, y: chunkPos.y, data: [] };
      this.chunks.push(chunk);
    }
    const chunkX = x - chunk.x * 16;
    const chunkY = y - chunk.y * 16;
    const index = chunkX + chunkY * 16;
    chunk.data[index] = tileId;
  }

  // Zeichnet das Hintergrundbild
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
      entity.update();
    });
  }

  draw() {
    // Zeichnet die Kacheln
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

        image(this.tiles[tile], (x + chunkPos.x) * SIZE, (y + chunkPos.y) * SIZE, SIZE, SIZE);
      });
    });

    // Zeichnet die Entities
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
