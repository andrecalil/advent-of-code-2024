import fs from 'fs';

let debug = false;

const log = (message) => {
    if (debug) {
        console.log(message);
    }
};

export default function Challenge04(isTest = false, isDebug = false) {
    debug = isDebug;

    const data = fs.readFileSync(`./04/input.${isTest ? 'test' : 'contest'}.txt`, 'utf8');
    const lines = data.split('\n');
    const matrix = [];

    lines.forEach((line) => {
        matrix.push(line.split(''));
    });

    const hasNeighboring = (i, j, char, dir) => {
        const DIRS = dir != null? [dir] : [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0,1], [1, -1], [1, 0], [1, 1]]; 

        const neighbors = [];

        for (let dir of DIRS) {
            const x = i + dir[0];
            const y = j + dir[1];

            if(x < 0 || y < 0 || x >= matrix.length || y >= matrix[x].length) continue;

            if (matrix[x][y] === char) {
                neighbors.push({ at: [x, y], dir: dir });
            }
        }

        return neighbors;
    };

    const part1 = () => {
        //All occurences of X
        const anchors = [];
        
        let count = 0;

        for(let i = 0; i < matrix.length; i++) {
            for(let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] === 'X') {
                    anchors.push([i, j]);
                }
            }
        }

        anchors.forEach((anchor) => {
            log(`X: ${anchor}`);
            
            const Ms = hasNeighboring(anchor[0], anchor[1], 'M', null);
            
            Ms.forEach((M) => {
                log(`  M: ${M.at}`);

                const As = hasNeighboring(M.at[0], M.at[1], 'A', M.dir);

                As.forEach((A) => {
                    log(`    A: ${A.at}`);

                    const Ss = hasNeighboring(A.at[0], A.at[1], 'S', A.dir);

                    Ss.forEach((N) => {
                        log(`      S: ${N.at}`);
                        count++;
                    });
                });
            });
        });

        return count;
    };

    const inverseDir = (dir) => dir.map((d) => -d);

    const part2 = () => {
        let count = 0;

        //All occurences of A
        const anchors = [];
        const anchorsWithXmas = [];

        for(let i = 0; i < matrix.length; i++) {
            for(let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] === 'A') anchors.push([i, j]);
            }
        }

        anchors.forEach((anchor) => {
            const Ms = hasNeighboring(anchor[0], anchor[1], 'M', null);
            const Ss = hasNeighboring(anchor[0], anchor[1], 'S', null);

            const corners = [[-1,-1], [-1, 1], [1, -1], [1, 1]];
            const cornerMs = Ms.filter((M) => {
                return corners.find((corner) => corner[0] === M.dir[0] && corner[1] === M.dir[1]);
            });

            cornerMs.forEach((M) => {
                const inverseS = Ss.find((S) => inverseDir(S.dir).toString() === M.dir.toString());

                if(inverseS) {
                    log(`A: [${anchor}]`);
                    log(`  M: [${M.at}] >> [${M.dir}]`);
                    log(`    S: [${inverseS.at}] >> [${inverseS.dir}]`);

                    anchorsWithXmas.push(anchor);

                    count ++
                };
            });
        });

        const duplicates = anchorsWithXmas.filter((item, index) => {
            return anchorsWithXmas.indexOf(item) !== index;
        });

        return duplicates.length;
    };

    console.log('Part 1: ', part1());
    console.log('Part 2: ', part2());
};