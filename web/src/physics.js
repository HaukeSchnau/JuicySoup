import Vector from "./vector";

export function collide(convertedPos, map, height) {
  const chunkPos = convertedPos.div(16);
  const chunks = map.chunks.filter(
    chunk =>
      chunkPos.x < chunk.x + 16 &&
      chunkPos.x + 1 > chunk.x &&
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
        convertedPos.x < x + 1 &&
        convertedPos.x + 1 > x &&
        convertedPos.y < y + 1 &&
        convertedPos.y + height > y
      ) {
        collision = new Vector(x, y);
      }
    });
  });

  return collision;
}
