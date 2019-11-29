import Vector from "./vector";

export function collide(entityPos, map, width, height) {
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

export function entyscollide(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}
