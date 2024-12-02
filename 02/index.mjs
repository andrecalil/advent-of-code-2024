import fs from 'fs';

let debug = false;

const log = (message) => {
    if (debug) {
        console.log(message);
    }
};

const isSafe = (levels, increasing, performSkip, skipped) => {
    const indexesToClear = [];
    let safe = false;

    if(increasing) {
      safe = levels.reduce((acc, level, index) => {
        if (index === 0) return acc;

        const prevLevel = levels[index - 1];
        const diff = level - prevLevel;

        if (level > prevLevel && diff >= 1 && diff <= 3) return acc && true;

        indexesToClear.push(index);
        indexesToClear.push(index - 1);

        return false;
      }, true);
    } else {
      safe = levels.reduce((acc, level, index) => {
        if (index === 0) return acc;

        const prevLevel = levels[index - 1];
        const diff = prevLevel - level;

        if (level < prevLevel && diff >= 1 && diff <= 3) return acc && true;

        indexesToClear.push(index);
        indexesToClear.push(index - 1);

        return false;
      }, true);
    }

    //This is the bit for part 2
    if(!safe && performSkip && !skipped) {
        for(const index of indexesToClear) {            
            const reduced = [...levels];
            reduced.splice(index, 1);

            const clearedSafe = isSafe(reduced, increasing, performSkip, true);
            const clearedSafeReverse = isSafe(reduced, !increasing, performSkip, true);

            if(clearedSafe || clearedSafeReverse) {
                safe = true;
                break;
            }
        }
    }

    return safe;
};

export default function Challenge02(isTest = false, isDebug = false) {
    debug = isDebug;

    const data = fs.readFileSync(`./02/input.${isTest ? 'test' : 'contest'}.txt`, 'utf8');
    const lines = data.split('\n');
    const allLevels = [];

    lines.forEach((line) => {
        const levels = line.split(' ').map(d => d.trim()).filter(Boolean).map(Number);

        allLevels.push(levels);
    });

    let safeLevelsPart1 = 0;
    let safeLevelsPart2 = 0;

    allLevels.forEach((levels) => {
        const increasingSafe = isSafe(levels, true, false, false);
        const decreasingSafe = isSafe(levels, false, false, false);

        if(!increasingSafe && !decreasingSafe) {
            log(`Levels: ${levels} unsafe on both`);
        }

        if(decreasingSafe || increasingSafe) safeLevelsPart1++;
    });

    allLevels.forEach((levels) => {
        const increasingSafe = isSafe(levels, true, true, false);
        const decreasingSafe = isSafe(levels, false, true, false);

        if(!increasingSafe && !decreasingSafe) {
            log(`Levels: ${levels} unsafe on both`);
        }

        if(decreasingSafe || increasingSafe) safeLevelsPart2++;
    });


    console.log('Part 1: ', safeLevelsPart1);
    console.log('Part 2: ', safeLevelsPart2);
};