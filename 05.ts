import { getFileContent, getDataAsArray } from './utils.js';

interface Step {
  count: number;
  from: number;
  to: number;
}

interface State {
  stacks: string[][];
  steps: Step[];
}

const parseInput = (str: string): State => {
  let isStack = true;
  let state: State = {
    stacks: [],
    steps: []
  }
  str.split('\n').forEach((line, i) => {
    if(i === 0) {
      state.stacks = [...Array(Math.floor(line.length / 4) + 1)].map(_ => []);
    }
    if(line.length === 0) {
      isStack = false;
      return;
    }
    if(isStack) {
      let positions = [];
      let current = -2;
      while(true) {
        current = line.indexOf('[', current + 1);
        if(current === -1) {
          break;
        }
        positions.push(current);
      }
      for(let pos of positions) {
        state.stacks[Math.floor(pos / 4)].unshift(line[pos + 1]);
      }
      return;
    }
    const regex = /move (?<count>\d+) from (?<from>\d+) to (?<to>\d+)/
    const { count, from, to } = line.match(regex)?.groups!;
    state.steps.push({
      count: parseInt(count),
      from: parseInt(from),
      to: parseInt(to)
    })
  });
  return state;
};

const process = (state: State): State => {
  state.steps.forEach(step => {
    for(let i = 0; i < step.count; i++) {
      state.stacks[step.to - 1].push(state.stacks[step.from - 1].pop()!);
    }
  })
  return state;
}

const processInSameOrder = (state: State): State => {
  state.steps.forEach(step => {
    const moving = state.stacks[step.from - 1].splice(state.stacks[step.from - 1].length - 1 - step.count, step.count);
    state.stacks[step.to - 1] = [...state.stacks[step.to - 1], ...moving]
    console.log(state.stacks)
  })
  return state;
}

const first = (state: State) => {
  const processed = process({...state});
  const result = processed.stacks.map(stack => stack[stack.length - 1]).join('');
  console.log(result);
  return result;
};

const second = (state: State) => {
  console.log('--- START ---', state.stacks);
  
  const processed = processInSameOrder(state);
  const result = processed.stacks.map(stack => stack[stack.length - 1]).join('');
  console.log(result);
  return result;
};

const data = parseInput(getFileContent('example.txt'));
const data2 = {...data};
console.assert(first(data) === 'WHTLRMZRC', 'Not matching first part');
console.assert(second(data2) === 'MCD', 'Not matching second part');
