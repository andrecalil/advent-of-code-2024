import fs from "fs";

let debug = false;

const log = (message) => {
  if (debug) {
    console.log(message);
  }
};

export default function Challenge11(isTest = false, isDebug = false) {
  debug = isDebug;

  const data = fs.readFileSync(
    `./11/input.${isTest ? "test" : "contest"}.txt`,
    "utf8"
  );

  const parts = data.split(" ");
  const stones = [];

  parts.forEach((part) => {
    stones.push(parseInt(part));
  });

  const processStone = (stone, currentBlink, totalBlinks) => {
    let resultingStones = [];

    if (stone === 0) resultingStones.push(1);
    else if (stone.toString().length % 2 === 0) {
      const valueAsString = stone.toString();
      const length = valueAsString.length;

      resultingStones.push(parseInt(valueAsString.substring(0, length / 2)));

      resultingStones.push(parseInt(valueAsString.substring(length / 2)));
    } else resultingStones.push(stone * 2024);

    currentBlink++;

    if (currentBlink === totalBlinks) return resultingStones.length;
    else return resultingStones.map((stone) => processStone(stone, currentBlink, totalBlinks)).reduce((a, b) => a + b, 0);
  };

  const process = (totalBlinks) => {
    let sum = 0;
    
    log(stones.map((x) => x).join(" "));
    log(`Blinks: ${totalBlinks}`);

    sum = stones.map((stone) => processStone(stone, 0, totalBlinks)).reduce((a, b) => a + b, 0);

    return sum;
  };

  console.log("Part 1: ", process(25));
  console.log("Part 2: ", process(75));
}