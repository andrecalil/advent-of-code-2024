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

  const walk = (fromObstacle = false, obstacleCount = 0) => {
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

    if (map[nextPosition[0]][nextPosition[1]] === "#" || [0,1,2,3,4,5,6,7,8,9].includes(map[nextPosition[0]][nextPosition[1]])) {
      obstacleCount++;

      obstacles.push({ coord: [...nextPosition], from: [...currentPosition], direction: newDirection, obstacleCount: obstacleCount });

      map[nextPosition[0]][nextPosition[1]] = obstacleCount;

      currentDirection = newDirection;
      return walk(true, obstacleCount);
    }

    map[currentPosition[0]][currentPosition[1]] = currentDirection;
    spots++;

    currentPosition[0] = nextPosition[0];
    currentPosition[1] = nextPosition[1];

    return walk(fromObstacle, obstacleCount);
  };

  const findSquares = () => {
    for(let i = 0; i < obstacles.length; i++) {
        let current = obstacles[i];
        const at = [...obstacles.from];

        switch (current.direction) {
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
    }
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

    log("Obstacles: " + obstacles.length);
    obstacles.forEach((obstacle) => {
      log(`  ${obstacle.coord} .. ${obstacle.from} .. ${obstacle.direction} .. ${obstacle.obstacleCount}`);
    });

    return count;
  };

  console.log("Part 1: ", part1());
  console.log("Part 2: ", part2());
}
