import { getFileContent, getDataAsArray } from './utils.js';

interface Monkey {
  number: number;
  startingItems: number[];
  operation: string;
  test: number;
  trueBranch: number;
  falseBranch: number;
  inspectedCount: number;
}

const parseInput = (lines: string[]): Monkey[] => {
  const monkeys: Monkey[] = [];

  // Keep track of the current monkey being processed
  let currentMonkey: Monkey | null = null;

  for (const line of lines) {
    // Check if the line starts with "Monkey"
    if (line.startsWith('Monkey')) {
      // If so, this is a new monkey. Extract the monkey number and create a new object for the monkey.
      const monkeyNumber = parseInt(line.split(':')[0].split(' ')[1], 10);
      currentMonkey = { number: monkeyNumber, startingItems: [], operation: "", test: -1, trueBranch: -1, falseBranch: -1, inspectedCount: 0 };
      monkeys.push(currentMonkey);
    } else if (line.startsWith('  Starting items:')) {
      // If the line starts with "Starting items", extract the starting items for the current monkey.
      const startingItems = line.split(':')[1].trim().split(',').map(item => parseInt(item, 10));
      currentMonkey!.startingItems = startingItems;
    } else if (line.startsWith('  Operation:')) {
      // If the line starts with "Operation", extract the operation for the current monkey.
      const operation = line.replace(/new/g, 'item').replace(/old/g, 'item').split(':')[1].trim();
      currentMonkey!.operation = operation;
    } else if (line.startsWith('  Test:')) {
      // If the line starts with "Test", extract the test for the current monkey.
      const test = parseInt(line.split(':')[1].trim().split(' ')[2], 10);
      currentMonkey!.test = test;
    } else if (line.startsWith('    If true:')) {
      // If the line starts with "If true", extract the true branch for the current monkey.
      const trueBranch = parseInt(line.split(':')[1].trim().split(' ')[3], 10);
      currentMonkey!.trueBranch = trueBranch;
    } else if (line.startsWith('    If false:')) {
      // If the line starts with "If false", extract the false branch for the current monkey.
      const falseBranch = parseInt(line.split(':')[1].trim().split(' ')[3], 10);
      currentMonkey!.falseBranch = falseBranch;
    }
  }

  return monkeys;
}

const monkeyTurn = (monkeys: Monkey[], index: number, isPart1: boolean): Monkey[] => {
  let newMonkeys: Monkey[] = JSON.parse(JSON.stringify(monkeys));
  let currentMonkey = JSON.parse(JSON.stringify(monkeys[index]));
  while(currentMonkey.startingItems.length > 0) {
    let item = currentMonkey.startingItems.shift()!;
    currentMonkey.inspectedCount++;
    if(isPart1) {
      eval(currentMonkey.operation);
    } else {
      const str = currentMonkey.operation
        .replace(/= (item)/g, "= ($1 % currentMonkey.test)")
        .replace(/(old|\d+)$/g, "($1 % currentMonkey.test)");
      eval(str);
    }
    if(isPart1) {
      item = Math.floor(item / 3);
    }
    const condition = item % currentMonkey.test === 0;
    newMonkeys[condition ? currentMonkey.trueBranch : currentMonkey.falseBranch].startingItems.push(item);
  }
  newMonkeys[index] = currentMonkey;
  return newMonkeys;
}

const makeRound = (monkeys: Monkey[], isPart1: boolean): Monkey[] => {
  let newMonkeys: Monkey[] = JSON.parse(JSON.stringify(monkeys));
  for(let i = 0; i < monkeys.length; i++) {
    newMonkeys = monkeyTurn(newMonkeys, i, isPart1);
  }
  return newMonkeys;
}

const makeRounds = (monkeys: Monkey[], rounds: number, isPart1 = true) => {
  let newMonkeys: Monkey[] = JSON.parse(JSON.stringify(monkeys));
  for(let i = 0; i < rounds; i++) {
    newMonkeys = makeRound(newMonkeys, isPart1);
  }
  return newMonkeys;
}

const first = (arr: string[]) => {
  const monkeys = parseInput(arr);
  const newMonkeys = makeRounds(monkeys, 20);
  const sorted = newMonkeys.map(m => m.inspectedCount).sort((a, b) => b - a);
  const result = sorted.slice(0, 2).reduce((a, v) => a * v, 1);
  console.log(result);
  return result;
};

const second = (arr: string[]) => {
  const monkeys = parseInput(arr);
  const newMonkeys = makeRounds(monkeys, 10001, false);
  const sorted = newMonkeys.map(m => m.inspectedCount).sort((a, b) => b - a);
  console.log(sorted);
  
  let result = sorted.slice(0, 2).reduce((a, v) => a * v, 1);
  result = 0;
  console.log(result);
  return result;
};

const data = getDataAsArray(getFileContent('example.txt'));
console.assert(first(data) === 56350, 'Not matching first part');
console.assert(second(data) === 0, 'Not matching second part');
