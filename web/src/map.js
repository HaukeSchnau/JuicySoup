import ground from "./assets/ground.png";
import ground2 from "./assets/ground2.png";
import bg from "./assets/bg1.jpg";
import { SIZE } from "./constants";
import Vector from "./vector";

class GameMap {
  constructor(sk) {
    this.sk = sk;
    this.chunks = [];
    this.tiles = [];
    this.tiles[1] = sk.loadImage(ground);
    this.tiles[2] = sk.loadImage(ground2);
    this.bg = sk.loadImage(bg);

    fetch("/api/map")
      .then(res => res.json())
      .then(chunks => (this.chunks = chunks));
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
    this.sk.image(this.bg, 0, 0, this.sk.windowWidth, this.sk.windowHeight);
  }

  draw() {
    this.chunks.forEach(chunk => {
      const chunkPos = new Vector(chunk.x, chunk.y).mul(16);
      chunk.data.forEach((tile, i) => {
        if (!tile) return;
        const y = Math.floor(i / 16);
        const x = i - y * 16;

        this.sk.image(
          this.tiles[tile],
          (x + chunkPos.x) * SIZE,
          (y + chunkPos.y) * SIZE,
          SIZE,
          SIZE
        );
      });
    });

    // for (let i = 0; i < this.map.length; i++) {
    //   let x = i;
    //   if (!this.map[x]) continue;

    //   for (let j = 0; j < this.map[x].length; j++) {
    //     let y = j;
    //     const tile = this.map[x][y];
    //     if (!tile) {
    //       continue;
    //     }

    //     this.sk.image(this.tiles[tile], x * SIZE, y * SIZE, SIZE, SIZE);
    //   }
    // }
  }
}

export default GameMap;
