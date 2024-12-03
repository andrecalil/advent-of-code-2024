import fs from 'fs';

let debug = false;

const log = (message) => {
    if (debug) {
        console.log(message);
    }
};

export default function Challenge03(isTest = false, isDebug = false) {
    debug = isDebug;

    const data = fs.readFileSync(`./03/input.${isTest ? 'test' : 'contest'}.txt`, 'utf8');
    let regex = /mul\((\d{1,3}),(\d{1,3})\)/g;
    let match;
    let pairs = [];

    while ((match = regex.exec(data)) !== null) {
        const x = parseInt(match[1], 10);
        const y = parseInt(match[2], 10);
        pairs.push([x, y]);
    }

    log(pairs);

    const sum = pairs.reduce((acc, pair) => {
        acc += pair[0] * pair[1];
        return acc;
    }, 0);

    const part2 = () => {
        regex = /mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don't\(\)/g;
        pairs = [];

        let skip = false;
    
        while ((match = regex.exec(data)) !== null) {
            const isPair = match[1] && match[2];
            const isDo = match[0] === 'do()';
            const isDont = match[0] === "don't()";

            if (isDo || isDont) {
                skip = isDont;
                continue;
            }

            if (skip) {
                continue;
            }

            const x = parseInt(match[1], 10);
            const y = parseInt(match[2], 10);
            pairs.push([x, y]);
        }
    
        log(pairs);

        return pairs.reduce((acc, pair) => {
            acc += pair[0] * pair[1];
            return acc;
        }, 0);
    };


    console.log('Part 1: ', sum);
    console.log('Part 2: ', part2());
};