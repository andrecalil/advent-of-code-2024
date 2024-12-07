import fs from "fs";

let debug = false;

const log = (message) => {
  if (debug) {
    console.log(message);
  }
};

export default function Challenge07(isTest = false, isDebug = false) {
  debug = isDebug;

  const data = fs.readFileSync(
    `./07/input.${isTest ? "test" : "contest"}.txt`,
    "utf8"
  );
  const lines = data.split("\n");
  const equations = [];

  lines.forEach((line) => {
    const equation = {};
    const parts = line.split(":");
    equation.testValue = parseInt(parts[0].trim());
    equation.operands = parts[1]
      .split(" ")
      .map((x) => x.trim())
      .filter(Boolean)
      .map(x => x);

    equations.push(equation);
  });

  const processNode = (node, stack, leg = []) => {
    leg.push(node.operation);

    if (node.children.length === 0) {
      stack.push(leg);
      return;
    }

    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      processNode(child, stack, [...leg]);
    }
  }

  const addNodes = (node, operators, totalOperands, currentLevel) => {
    operators.forEach((op) => {
      node.children.push({ operation: op, children: [] });
    });
    currentLevel++;

    if (currentLevel < totalOperands) {
      node.children.forEach((child) => {
        addNodes(child, operators, totalOperands, currentLevel);
      });
    }
  }

  const equationMatches = (equation, operators) => {
    for(const operator of operators) {
      let currentSum = 0;

      for(let i = 0; i < equation.operands.length; i++) {
        const operand = equation.operands[i];

        if(i === 0) {
          currentSum = parseInt(operand);
          continue;
        }

        switch(operator) {
          case "+":
            currentSum += parseInt(operand);
            break;
          case "*":
            currentSum *= parseInt(operand);
            break;
          case "||":
            currentSum = parseInt(`${currentSum}${operand}`);
            break;
        }
      }

      if(currentSum === equation.testValue) return true;
    }

    // const allSum = equation.operands.reduce((acc, x) => acc + x, 0);
    // const allMultiply = equation.operands.reduce((acc, x) => acc * x, 1);

    // if (allSum === equation.testValue || allMultiply === equation.testValue) return true;

    const totalOperations = equation.operands.length - 1;

    if (totalOperations === 1) return false;

    const possibleCombinations = Math.pow(operators.length, totalOperations);
    const operations = [];

    operators.forEach((op) => {
      operations.push({ operation: op, children: [] });
    });

    operations.forEach((op) => {
      addNodes(op, operators, totalOperations, 1);
    });

    const operationsToProcess = [];
    
    operations.forEach((op) => {
      processNode(op, operationsToProcess, []);
    });

    log(`${equation.operands} = ${equation.testValue} ?`);

    for(const o of operationsToProcess) {
      let currentSum = 0;
      for(let i = 0; i < equation.operands.length; i++) {
        const operand = equation.operands[i];

        if(i === 0) {
          log(`   First: ${operand}`);
          currentSum = parseInt(operand);
          continue;
        }

        const op = o[i - 1];

        log(`   ${currentSum} ${op} ${operand}`);
        
        switch(op) {
          case "+":
            currentSum += parseInt(operand);
            break;
          case "*":
            currentSum *= parseInt(operand);
            break;
          case "||":
            currentSum = parseInt(`${currentSum}${operand}`);
            break;
        }
      }

      log(`  ${o} = ${currentSum}`);

      if(currentSum === equation.testValue) return true;
    }

    return false;
  };

  const part1 = () => {
    let sum = 0;

    const operators = ['+', '*'];

    equations.forEach((equation) => {
      if (equationMatches(equation, operators)) sum += equation.testValue;
    });

    return sum;
  };

  const part2 = () => {
    let sum = 0;

    const operators = ['+', '*', '||'];

    equations.forEach((equation) => {
      if (equationMatches(equation, operators)) sum += equation.testValue;
    });

    return sum;
  };

  console.log("Part 1: ", part1());
  console.log("Part 2: ", part2());
}
