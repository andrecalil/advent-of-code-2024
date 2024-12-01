import fs from 'fs';

let debug = false;

const log = (message) => {
    if (debug) {
        console.log(message);
    }
};

export default function Challenge01(isTest = false, isDebug = false) {
    debug = isDebug;

    const data = fs.readFileSync(`./01/input.${isTest ? 'test' : 'contest'}.txt`, 'utf8');
    const lines = data.split('\n');
    const leftList = [];
    const rightList = [];

    lines.forEach((line) => {
        const [left, right] = line.split(' ').map(d => d.trim()).filter(Boolean).map(Number);

        leftList.push(left);
        rightList.push(right);
    });

    const sortedLeft = [...leftList].sort((a, b) => a - b);
    const sortedRight = [...rightList].sort((a, b) => a - b);

    log(sortedLeft);
    log(sortedRight);

    let diff = 0;

    for(let i = 0; i < sortedLeft.length; i++) {
        diff +=Math.abs(sortedLeft[i] - sortedRight[i]);
    }

    console.log('Part 1', diff);

    let similarity = 0;

    for(const l of leftList) {
        similarity += l * rightList.filter(r => r === l).length;
    }

    console.log('Part 2', similarity);
}