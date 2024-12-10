import fs from "fs";
import { join } from "path";

let debug = false;

const log = (message) => {
  if (debug) {
    console.log(message);
  }
};

export default function Challenge09(isTest = false, isDebug = false) {
  debug = isDebug;

  const data = fs.readFileSync(
    `./10/input.${isTest ? "test" : "contest"}.txt`,
    "utf8"
  );
  const lines = data.split("\n");
  const map = lines.map((line) => line.split("").map(Number));
  const trailheads = [];

  map.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 0) {
        trailheads.push({ x, y });
      }
    });
  });

  const walk = (trailhead, from, step, at) => {
    const isFrom = (x, y) => x === from.x && y === from.y;

    let up = map[at.y - 1]?.[at.x] ?? null;
    let down = map[at.y + 1]?.[at.x] ?? null;
    let left = map[at.y]?.[at.x - 1] ?? null;
    let right = map[at.y]?.[at.x + 1] ?? null;

    if(up && isFrom(at.x, at.y - 1)) up = null;
    if(down && isFrom(at.x, at.y + 1)) down = null;
    if(left && isFrom(at.x - 1, at.y)) left = null;
    if(right && isFrom(at.x + 1, at.y)) right = null;

    log(`${' '.repeat(step)}${step} [${at.x},${at.y}]`);

    if(step === 8) {
      //log(8);
      if(up === 9) trailhead.ends.push({ x: at.x, y: at.y - 1 });
      if(down === 9) trailhead.ends.push({ x: at.x, y: at.y + 1 });
      if(left === 9) trailhead.ends.push({ x: at.x - 1, y: at.y });
      if(right === 9) trailhead.ends.push({ x: at.x + 1, y: at.y });

      return;
    }

    if (up === step + 1) {
      walk(trailhead, at, up, { x: at.x, y: at.y - 1 });
    }

    if (down === step + 1) {
      walk(trailhead, at, down, { x: at.x, y: at.y + 1 });
    }

    if (left === step + 1) {
      walk(trailhead, at, left, { x: at.x - 1, y: at.y });
    }

    if (right === step + 1) {
      walk(trailhead, at, right, { x: at.x + 1, y: at.y });
    }
  };

  trailheads.forEach((trailhead) => {
    trailhead.ends = [];
    walk(trailhead, trailhead, 0, trailhead);
  });

  const part1 = () => {
    let sum = 0;

    trailheads.forEach((trailhead) => {
      const uniqueEnds = new Set(trailhead.ends.map(end => `${end.x},${end.y}`));
      sum += uniqueEnds.size;
    });

    return sum;
  };

  const part2 = () => {
    let sum = 0;

    trailheads.forEach((trailhead) => {
      sum += trailhead.ends.length;
    });

    return sum;
  };

  console.log("Part 1: ", part1());
  console.log("Part 2: ", part2());
}
