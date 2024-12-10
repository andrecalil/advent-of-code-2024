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
    `./09/input.${isTest ? "test" : "contest"}.txt`,
    "utf8"
  );
  //const lines = data.split("\n");
  const logLength = data.length;
  const files = [];
  const freeSpace = [];
  const entries = [];

  data.split("").forEach((entry, index) => {
    const isFile = index % 2 === 0;

    const saveto = isFile ? files : freeSpace;
    const id = entries.filter((e) => e.isFile === isFile).length;

    saveto.push({
      id: id,
      originalIndex: index,
      length: parseInt(entry),
    });

    entries.push({
      id: id,
      originalIndex: index,
      length: parseInt(entry),
      isFile,
    });
  });

  const swapPositions = (array, pos1, pos2) => {
    const temp = array[pos1];
    array[pos1] = array[pos2];
    array[pos2] = temp;
  };

  const serialize = () => {
    const result = [];

    entries.forEach((entry) => {
      if (entry.isFile) {
        for (let i = 0; i < entry.length; i++) result.push({ ...entry });
      } else {
        result.push(...".".repeat(entry.length).split(""));
      }
    });

    return result;
  };

  const fitsFile = (serialized, length) => {
    let str = '';
    for(const entry of serialized) {
      if (entry === ".") str += ".";
      else str += '-';
    }

    return str.indexOf(".".repeat(length));
  };

  const fullyOptimized = (serialized) => {
    const count = serialized.reduce((acc, curr) => {
      if (curr === ".") return ++acc;
      else return acc;
    }, 0);
    return serialized.join("").endsWith(".".repeat(count));
  };

  const findFirstFreeSpace = (serialized) => {
    for (let i = 0; i < serialized.length; i++) {
      if (serialized[i] === ".") {
        //log(`${serialized.join("")} --> ${i}`);
        return i;
      }
    }
  };

  const optimize = (serialized, part2 = false) => {
    // log(serialized.join(""));
    // log("---");

    const result = [...serialized];
    const optimizedIds = [];

    for (let j = serialized.length - 1; j >= 0; j--) {
      //log(serialized[j]);
      if (serialized[j] !== ".") {
        if (part2) {
          if (optimizedIds.includes(serialized[j].id)) continue;

          let to = fitsFile(result, serialized[j].length);
          if (to !== -1 && to < j) {
            let from = j;

            for(let i = 1; i <= serialized[j].length; i++) {
              swapPositions(result, from, to);
              from--;
              to++;
            }

            optimizedIds.push(serialized[j].id);
          }
        } else {
          const to = findFirstFreeSpace(result);
          swapPositions(result, j, to);
        }
      }

      if (fullyOptimized(result)) break;
    }

    return result;
  };

  const toString = (serialized) => {
    return serialized.reduce((acc, curr) => {
      if (curr === ".") return acc + ".";
      else return acc + curr.id;
    }, "");
  };

  const part1 = () => {
    let sum = 0;

    //log(entries);

    const serialized = serialize();
    const optimized = optimize(serialized);

    log(toString(serialized));
    log(toString(optimized));

    sum = optimized.reduce((acc, curr, index) => {
      if (curr !== ".") {
        acc += curr.id * index;
      }

      return acc;
    }, 0);

    return sum;
  };

  const part2 = () => {
    let sum = 0;

    const serialized = serialize();
    const optimized = optimize(serialized, true);

    log(toString(serialized));
    log(toString(optimized));

    sum = optimized.reduce((acc, curr, index) => {
      if (curr !== ".") {
        acc += curr.id * index;
      }

      return acc;
    }, 0);

    return sum;
  };

  //console.log("Part 1: ", part1());
  console.log("Part 2: ", part2());
}
