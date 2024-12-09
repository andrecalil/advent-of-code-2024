import fs from "fs";

let debug = false;

const log = (message) => {
  if (debug) {
    console.log(message);
  }
};

export default function Challenge08(isTest = false, isDebug = false) {
  debug = isDebug;

  const data = fs.readFileSync(
    `./08/input.${isTest ? "test" : "contest"}.txt`,
    "utf8"
  );
  const lines = data.split("\n");
  const matrix = [];
  const antennas = [];
  const antinodes = [];
  const generatedAntinodes = [];

  lines.forEach((line, lineIndex) => {
    if (!line) return;

    const parts = line.split("");
    matrix.push(parts);

    parts.forEach((part, partIndex) => {
      if (part !== ".") {
        antennas.push({
          x: partIndex,
          y: lineIndex,
          value: part,
        });
      }
    });
  });

  const matchAntennas = () => {
    const antennasPairs = [];

    for (let a = 0; a < antennas.length; a++) {
      for (let b = 1; b < antennas.length; b++) {
        if (a === b) continue;
        
        const antennaA = antennas[a];
        const antennaB = antennas[b];

        if (antennaA.value === antennaB.value) antennasPairs.push({ a: antennaA, b: antennaB });
      }
    }

    return antennasPairs;
  };

  const markGeneratedAntinode = (antennaA, antennaB) => {
    const antinode = generatedAntinodes.find(
      (a) => a.xA === antennaA.x && a.yA === antennaA.y && a.xB === antennaB.x && a.yB === antennaB.y
    );
    if (antinode) return true;

    generatedAntinodes.push({ xA: antennaA.x, yA: antennaA.y, xB: antennaB.x, yB: antennaB.y });
    return false;
  };

  const markAntinode = (antenna) => {
    const antinode = antinodes.find(
      (a) => a.x === antenna.x && a.y === antenna.y
    );
    if (antinode) antinode.count++;
    else antinodes.push({ x: antenna.x, y: antenna.y, count: 1 });
  }

  const placeAntinodes = (antennaA, antennaB) => {
    if(markGeneratedAntinode(antennaA, antennaB)) return;
    
    const first = antennaA.x < antennaB.x ? antennaA : antennaB;
    const last = antennaA.x > antennaB.x ? antennaA : antennaB;

    const vertical = first.x === last.x;
    const horizontal = first.y === last.y;
    const upward = first.y > last.y && first.x < last.x;

    const antinodeA = { x: 0, y: 0 };
    const antinodeB = { x: 0, y: 0 };

    if (vertical) {
      const dist = first.y - last.y;

      antinodeA.x = first.x;
      antinodeA.y = first.y - dist;

      antinodeB.x = first.x;
      antinodeB.y = last.y + dist;
    } else if (horizontal) {
      const dist = first.x - last.x;

      antinodeA.x = first.x - dist;
      antinodeA.y = first.y;

      antinodeB.x = last.x + dist;
      antinodeB.y = first.y;
    } else if (upward) {
      const distX = Math.abs(first.x - last.x);
      const distY = Math.abs(first.y - last.y);

      antinodeA.x = first.x - distX;
      antinodeA.y = first.y + distY;

      antinodeB.x = last.x + distX;
      antinodeB.y = last.y - distY;
    } else {
      const distX = Math.abs(first.x - last.x);
      const distY = Math.abs(first.y - last.y);

      antinodeA.x = first.x - distX;
      antinodeA.y = first.y - distY;

      antinodeB.x = last.x + distX;
      antinodeB.y = last.y + distY;
    }

    markAntinode(antennaA);
    markAntinode(antennaB);

    const skipAntinodeA =
      antinodeA.x < 0 ||
      antinodeA.y < 0 ||
      antinodeA.y >= matrix.length ||
      antinodeA.x >= matrix[0].length;
    const skipAntinodeB =
      antinodeB.x < 0 ||
      antinodeB.y < 0 ||
      antinodeB.y >= matrix.length ||
      antinodeB.x >= matrix[0].length;

    if (!skipAntinodeA) {
      const aValue = matrix[antinodeA.y][antinodeA.x];

      markAntinode(antinodeA);

      if (aValue === ".") {
        matrix[antinodeA.y][antinodeA.x] = "#";
      }

      placeAntinodes(antennaA, { ...antennaA, ...antinodeA });
      placeAntinodes(antennaB, { ...antennaA, ...antinodeA });
      //placeAntinodes({ ...antennaA, ...antinodeA }, antennaA);
    }

    if (!skipAntinodeB) {
      const bValue = matrix[antinodeB.y][antinodeB.x];

      markAntinode(antinodeB);

      if (bValue === ".") {
        matrix[antinodeB.y][antinodeB.x] = "#";
      }

      placeAntinodes(antennaB, { ...antennaB, ...antinodeB });
      placeAntinodes(antennaA, { ...antennaB, ...antinodeB });
      //placeAntinodes({ ...antennaB, ...antinodeB }, antennaB);
    }

    if(!skipAntinodeA && !skipAntinodeB) placeAntinodes(antinodeA, antinodeB);
  };

  const part1 = () => {
    let sum = 0;

    matrix.forEach((line, lineIndex) => {
      log(line.join(""));
    });
    log("");
    log("-------------------------------------------");
    log("");

    const antennasPairs = matchAntennas();
    log(antennasPairs);
    antennasPairs.forEach((pair) => {
      placeAntinodes(pair.a, pair.b);
    });

    sum = antinodes.filter((a) => a.count === 1).length;

    matrix.forEach((line) => {
      log(line.join(""));
    });

    antinodes.forEach((a) => {
      log(`${a.x},${a.y}: ${a.count}`);
    });

    return antinodes.length;
  };

  const part2 = () => {
    let sum = 0;

    return sum;
  };

  console.log("Part 1: ", part1());
  console.log("Part 2: ", part2());
}


