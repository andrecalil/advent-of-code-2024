import fs from "fs";

let debug = false;

const log = (message) => {
  if (debug) {
    console.log(message);
  }
};

export default function Challenge05(isTest = false, isDebug = false) {
  debug = isDebug;

  const data = fs.readFileSync(
    `./05/input.${isTest ? "test" : "contest"}.txt`,
    "utf8"
  );
  const lines = data.split("\n");

  const printRules = [];
  const pageSets = [];

  const rulesPerPage = [];

  lines.forEach((line) => {
    if (line.indexOf("|") > -1) {
      const [before, after] = line
        .split("|")
        .map((pages) => parseInt(pages.trim()));
      printRules.push({ before, after });
    } else if (line !== "") {
      pageSets.push(line.split(",").map((page) => parseInt(page)));
    }
  });

  const pageList = new Set([
    ...printRules.map((r) => r.before),
    ...printRules.map((r) => r.after),
  ]);

  pageList.forEach((page) => {
    rulesPerPage[page] = {
      before: printRules
        .filter((rule) => rule.before === page)
        .map((rule) => rule.after),
      after: printRules
        .filter((rule) => rule.after === page)
        .map((rule) => rule.before),
    };
  });

  const isValidPosition = (index, page, pageSet, includeBefore = true) => {
    const before = rulesPerPage[page].before;
    const after = rulesPerPage[page].after;

    log(`Rules for page ${page}:`);
    log(`  Before: ${before}`);
    log(`  After: ${after}`);

    const pagesBefore = [...pageSet].slice(0, index);
    const pagesAfter = [...pageSet].slice(index + 1);

    let isValidBefore = true;
    let isValidAfter = true;

    if (pagesBefore.length > 0 && includeBefore)
      pagesBefore.forEach((pb) => {
        if (after.indexOf(pb) < 0) isValidBefore = false;
      });
    if (pagesAfter.length > 0)
      pagesAfter.forEach((pa) => {
        if (before.indexOf(pa) < 0) isValidAfter = false;
      });

    return isValidAfter && isValidBefore;
  };

  const findValidChunk = (set) => {
    let chunk = [];

    for (let i = 0; i < set.length; i++) {
      const page = set[i];

      if (isValidPosition(i, page, set, false)) {
        chunk.push(page);
      } else break;
    }

    return chunk;
  };

  const isValidSet = (set) => {
    for (let i = 0; i < set.length; i++) {
      if (!isValidPosition(i, set[i], set))
        return { valid: false, index: i, set: set };
    }

    return { valid: true, set: set };
  };

  const shuffle = (set, indexToShuffle) => {
    const shuffled = [...set];
    const temp = shuffled[indexToShuffle];

    const newIndex =
      indexToShuffle + 1 > shuffled.length - 1 ? 0 : indexToShuffle + 1;

    shuffled[indexToShuffle] = shuffled[newIndex];
    shuffled[newIndex] = temp;

    return shuffled;
  };

  const part1 = () => {
    const validPageSets = [];

    pageSets.forEach((pageSet) => {
      const validation = isValidSet(pageSet);

      if (validation.valid) {
        validPageSets.push(pageSet);
      }
    });

    log(validPageSets);

    return validPageSets
      .map((set) => set[Math.round(set.length / 2) - 1])
      .reduce((acc, page) => acc + page, 0);
  };

  const part2 = () => {
    const invalidSets = [];

    pageSets.forEach((pageSet) => {
      const validation = isValidSet(pageSet);

      if (!validation.valid) invalidSets.push(validation);
    });

    const validated = [];

    invalidSets.forEach((invalidSet) => {
      log(`Invalid set with good chunk: ${findValidChunk(invalidSet.set)}`);
      let currentSet = { ...invalidSet };

      wholeSet: while (!currentSet.valid) {
        //log(`Outer: ${currentSet.set}`);
        for (let i = 0; i < currentSet.set.length; i++) {
          const page = currentSet.set[i];
          let set = [...currentSet.set];
          let currentIndex = i;

          log(`Finding a place for ${page} in ${set} (${set.length})`);

          byChar: while (!isValidPosition(currentIndex, page, set)) {
            log(`  Not in ${currentIndex} as ${set}`);
            set = shuffle(set, currentIndex);

            if (currentIndex === set.length - 1) currentIndex = 0;
            else currentIndex++;

            if (currentIndex === i) break wholeSet;
          }

          log(`  Found in ${currentIndex}`);

          currentSet = isValidSet(set);
        }
      }

      if (currentSet.valid) {
        validated.push(currentSet.set);
        log(`Original: ${invalidSet.set} - Validated: ${currentSet.set}`);
      }
    });

    log(validated);

    return validated
      .map((set) => set[Math.round(set.length / 2) - 1])
      .reduce((acc, page) => acc + page, 0);
  };

  console.log("Part 1: ", part1());
  console.log("Part 2: ", part2());
}
