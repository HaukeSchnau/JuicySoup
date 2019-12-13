import Vector from "./vector";
import { map } from "./game";

// Kollisionserkennung eines Entities mit der gesamten Map
// gibt Position des Blockes zurück, mit dem
export function collide(entityPos, width, height) {
  const chunkPos = entityPos.div(16);
  const chunks = map.chunks.filter(
    chunk =>
      chunkPos.x < chunk.x + 16 &&
      chunkPos.x + width > chunk.x &&
      chunkPos.y < chunk.y + 16 &&
      chunkPos.y + height > chunk.y
  );
  let collision = null;
  chunks.forEach(chunk => {
    chunk.data.forEach((tile, i) => {
      if (!tile) return;
      let y = Math.floor(i / 16);
      let x = i - y * 16;
      y += chunk.y * 16;
      x += chunk.x * 16;

      if (
        entityPos.x < x + 1 &&
        entityPos.x + width > x &&
        entityPos.y < y + 1 &&
        entityPos.y + height > y
      ) {
        collision = new Vector(x, y);
      }
    });
  });

  return collision;
}

export function entitiesCollide(e1, e2) {
  return (
    e1.pos.x < e2.pos.x + e2.width &&
    e1.pos.x + e1.width > e2.pos.x &&
    e1.pos.y < e2.pos.y + e2.height &&
    e1.pos.y + e1.height > e2.pos.y
  );
}
