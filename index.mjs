import chalk from 'chalk';
import fs from 'fs';
import { select } from '@inquirer/prompts';
import Challenge01 from './01/index.mjs';
import Challenge02 from './02/index.mjs';
import Challenge03 from './03/index.mjs';
import Challenge04 from './04/index.mjs';
import Challenge05 from './05/index.mjs';
import Challenge06 from './06/index.mjs';
import Challenge07 from './07/index.mjs';
import Challenge08 from './08/index.mjs';
import Challenge09 from './09/index.mjs';
import Challenge10 from './10/index.mjs';
import Challenge11 from './11/index.mjs';

const welcome = fs.readFileSync('title.txt', 'utf8');                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                              
console.log(chalk.white.bgRed(welcome)); 
console.log(''); 

const debug = await select({
    message: chalk.blue.bold("Debug mode?"),
    choices: [
      {
        name: chalk.white.bgBlue("Yes"),
        value: true,
        description: "Verbose",
      },
      {
        name: chalk.white.bgBlue("No"),
        value: false,
        description: "Result only",
      },
    ],
  });

const inputMode = await select({
  message: chalk.yellow.bold("Choose the mode you want to run:"),
  choices: [
    {
      name: chalk.white.bgYellow("TEST"),
      value: true,
      description: "Test dataset",
    },
    {
      name: chalk.white.bgYellow("CONTEST"),
      value: false,
      description: "Real dataset",
    },
  ],
});

const challenge = await select({
  message: chalk.green.bold("Choose the challenge you want to run:"),
  choices: [
    {
      name: chalk.white.bgGreen("11"),
      value: Challenge11,
      description: "Challenge 11",
    },{
      name: chalk.white.bgGreen("10"),
      value: Challenge10,
      description: "Challenge 10",
    },{
      name: chalk.white.bgGreen("09"),
      value: Challenge09,
      description: "Challenge 09",
    },
    {
      name: chalk.white.bgGreen("08"),
      value: Challenge08,
      description: "Challenge 08",
    },
    {
      name: chalk.white.bgGreen("07"),
      value: Challenge07,
      description: "Challenge 07",
    },
    {
      name: chalk.white.bgGreen("06"),
      value: Challenge06,
      description: "Challenge 06",
    },
    {
      name: chalk.white.bgGreen("05"),
      value: Challenge05,
      description: "Challenge 05",
    },
    {
      name: chalk.white.bgGreen("04"),
      value: Challenge04,
      description: "Challenge 04",
    },
    {
      name: chalk.white.bgGreen("03"),
      value: Challenge03,
      description: "Challenge 03",
    },
    {
      name: chalk.white.bgGreen("02"),
      value: Challenge02,
      description: "Challenge 02",
    },
    {
      name: chalk.white.bgGreen("01"),
      value: Challenge01,
      description: "Challenge 01",
    },
  ],
});

console.log('');

challenge(inputMode, debug);

console.log('');