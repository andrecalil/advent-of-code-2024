import fs from "fs";

let debug = false;

const log = (message) => {
  if (debug) {
    console.log(message);
  }
};

export default function Challenge06(isTest = false, isDebug = false) {
  debug = isDebug;

  const data = fs.readFileSync(
    `./06/input.${isTest ? "test" : "contest"}.txt`,
    "utf8"
  );
  const lines = data.split("\n");
  const map = lines.map((line) => line.split(""));
  const obstacles = [];
  const currentPosition = [0, 0];
  let currentDirection = "^";
  let isOut = false;
  let spots = 0;

  const prepare = () => {
    outer: for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        if ("^>v<".includes(map[i][j])) {
          currentPosition[0] = i;
          currentPosition[1] = j;
          currentDirection = map[i][j];

          break outer;
        }
      }
    }

    log("Current position: " + currentPosition);
    log("Current direction: " + currentDirection);
  };

  const walk = () => {
    let nextPosition = [...currentPosition];
    let newDirection = currentDirection;

    switch (currentDirection) {
      case "^":
        nextPosition[0] -= 1;
        newDirection = ">";
        break;
      case "v":
        nextPosition[0] += 1;
        newDirection = "<";
        break;
      case "<":
        nextPosition[1] -= 1;
        newDirection = "^";
        break;
      case ">":
        nextPosition[1] += 1;
        newDirection = "v";
        break;
    }

    if (
      nextPosition[0] < 0 ||
      nextPosition[0] >= map.length ||
      nextPosition[1] < 0 ||
      nextPosition[1] >= map[0].length
    ) {
      isOut = true;
      map[currentPosition[0]][currentPosition[1]] = "X";
      spots++;
      return;
    }

    if (map[nextPosition[0]][nextPosition[1]] === "#") {
      obstacles.push([...nextPosition]);

      currentDirection = newDirection;
      return walk();
    }

    map[currentPosition[0]][currentPosition[1]] = "X";
    spots++;

    currentPosition[0] = nextPosition[0];
    currentPosition[1] = nextPosition[1];

    return walk();
  };

  const part1 = () => {
    let count = 0;
    prepare();

    while (!isOut) {
      walk();
    }

    for (let i = 0; i < map.length; i++) {
      log(map[i].join(""));
      for(let j = 0; j < map[i].length; j++) {
          if (map[i][j] === 'X') {
              count++;
          }
      }
    }
    return count;
  };

  const part2 = () => {
    let count = 0;

    return count;
  };

  console.log("Part 1: ", part1());
  console.log("Part 2: ", part2());
}