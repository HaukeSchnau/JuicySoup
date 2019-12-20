import Vector from "./vector";
import { map } from "./game";

// Low-level Kollisionserkennung zweier achsenparalleler Rechtecke
function rectCollide(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

// Kollisionserkennung eines Entities mit der gesamten Map
// gibt Position des Blockes zurück, mit dem eine Kollision stattfindet
export function collide(entityPos, width, height) {
  const chunkPos = entityPos.div(16);
  const chunks = map.chunks.filter(chunk =>
    rectCollide(chunkPos.x, chunkPos.y, width / 16, height / 16, chunk.x, chunk.y, 1, 1)
  );
  let collision = null;
  chunks.forEach(chunk => {
    chunk.data.forEach((tile, i) => {
      if (!tile) return;
      let y = Math.floor(i / 16);
      let x = i - y * 16;
      y += chunk.y * 16;
      x += chunk.x * 16;

      if (rectCollide(entityPos.x, entityPos.y, width, height, x, y, 1, 1)) {
        collision = new Vector(x, y);
      }
    });
  });

  return collision;
}

// Kollisionserkennung eines rotierten Entities mit der gesamten Map
export function rotatedCollide(entityPos, width, height, angle) {
  const chunkPos = entityPos.div(16);
  const chunks = map.chunks.filter(chunk =>
    rotatedCollideRect(chunkPos, width / 16, height / 16, angle, chunk.x, chunk.y, 1, 1)
  );
  let collision = null;
  chunks.forEach(chunk => {
    chunk.data.forEach((tile, i) => {
      if (!tile) return;
      let y = Math.floor(i / 16);
      let x = i - y * 16;
      y += chunk.y * 16;
      x += chunk.x * 16;

      if (rotatedCollideRect(entityPos, width, height, angle, x, y, 1, 1)) {
        collision = new Vector(x, y);
      }
    });
  });

  return collision;
}

// Kollision eines rotierten Rechteckes mit einem achsenparallelen Rechteck
export function rotatedCollideRect(
  entityPos,
  width,
  height,
  angle,
  blockX,
  blockY,
  blockWidth,
  blockHeight
) {
  let collision = true;
  const rotRad = angle * (Math.PI / 180);
  const rotMatrix = [
    [Math.cos(rotRad), -Math.sin(rotRad)],
    [Math.sin(rotRad), Math.cos(rotRad)]
  ];

  const poly = [
    new Vector(-width / 2, -height / 2),
    new Vector(width / 2, -height / 2),
    new Vector(width / 2, height / 2),
    new Vector(-width / 2, height / 2)
  ];

  const newPoly = poly.map(p =>
    new Vector(
      p.x * rotMatrix[0][0] + p.y * rotMatrix[0][1],
      p.x * rotMatrix[1][0] + p.y * rotMatrix[1][1]
    ).add(entityPos.x + width / 2, entityPos.y + height / 2)
  );
  const testPoly = [
    new Vector(blockX, blockY + blockHeight),
    new Vector(blockX + blockWidth, blockY + blockHeight),
    new Vector(blockX + blockWidth, blockY),
    new Vector(blockX, blockY)
  ];
  const newPolyEdges = newPoly.map((p, i) => p.subV(newPoly[i + 1 < newPoly.length ? i + 1 : 0]));
  const testPolyEdges = testPoly.map((p, i) =>
    p.subV(testPoly[i + 1 < testPoly.length ? i + 1 : 0])
  );
  const projektionsflächen = newPolyEdges.concat(testPolyEdges).map(e => new Vector(-e.y, e.x));
  projektionsflächen.forEach(fläche => {
    let newPolyProjMin = Infinity;
    let newPolyProjMax = -Infinity;
    let testPolyProjMin = Infinity;
    let testPolyProjMax = -Infinity;
    newPoly.forEach(p => {
      const dot = p.dot(fläche);
      if (dot < newPolyProjMin) newPolyProjMin = dot;
      if (dot > newPolyProjMax) newPolyProjMax = dot;
    });
    testPoly.forEach(p => {
      const dot = p.dot(fläche);
      if (dot < testPolyProjMin) testPolyProjMin = dot;
      if (dot > testPolyProjMax) testPolyProjMax = dot;
    });
    if (!(newPolyProjMin < testPolyProjMax && newPolyProjMax > testPolyProjMin)) {
      collision = false;
    }
  });
  return collision;
}

// Kollision zwischen zwei Entities
export function entitiesCollide(e1, e2) {
  return (
    e1.pos.x < e2.pos.x + e2.width &&
    e1.pos.x + e1.width > e2.pos.x &&
    e1.pos.y < e2.pos.y + e2.height &&
    e1.pos.y + e1.height > e2.pos.y
  );
}
