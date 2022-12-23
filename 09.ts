import { getFileContent, getDataAsArray } from './utils.js';

interface Mapper {
  [key: string]: number[]
}

const dirMapper: Mapper = {
  'U': [0, 1],
  'R': [1, 0],
  'D': [0, -1],
  'L': [-1, 0]
}

const move = (direction: string, head: number[], tail: number[]): [number[], number[], Set<string>] => {
  let uniqueSteps = new Set<string>();
  const newHead = [head[0] + dirMapper[direction][0], head[1] + dirMapper[direction][1]]
  let newTail = tail;
  const vectorDist = Math.sqrt(((newHead[0] - tail[0]) ** 2) + ((newHead[1] - tail[1]) ** 2))
  
  if(newHead[0] === tail[0] || newHead[1] === tail[1]) {
    if(vectorDist > 1) {
      if(newHead[0] === tail[0]) {
        newTail[1] = newHead[1] > tail[1] ? tail[1] + 1 : newHead[1] + 1;
      } else {
        newTail[0] = newHead[0] > tail[0] ? tail[0] + 1 : newHead[0] + 1;
      }
    }
  } else {
    if(vectorDist > 2.23) {
      newTail[0] += newHead[0] > tail[0] ? 1 : -1;
      newTail[1] += newHead[1] > tail[1] ? 1 : -1;
    }
  }
  head = newHead;
  tail = newTail;
  if(!uniqueSteps.has(JSON.stringify(tail))) uniqueSteps.add(JSON.stringify(tail));
  return [newHead, newTail, uniqueSteps];
}

const movePart2 = (direction: string, knots: number[][]): [number[][], Set<string>] => {
  let newKnots = [...Array(10)].map(_ => [0, 0]);
  let uniqueSteps = new Set<string>();
  for(let i = 1; i < 10; i++) {
    const head = knots[i];
    const tail = knots[i - 1];
    const newHead = [head[0] + dirMapper[direction][0], head[1] + dirMapper[direction][1]]
    let newTail = tail;
    const vectorDist = Math.sqrt(((newHead[0] - tail[0]) ** 2) + ((newHead[1] - tail[1]) ** 2))
    
    if(newHead[0] === tail[0] || newHead[1] === tail[1]) {
      if(vectorDist > 1) {
        if(newHead[0] === tail[0]) {
          newTail[1] = newHead[1] > tail[1] ? tail[1] + 1 : newHead[1] + 1;
        } else {
          newTail[0] = newHead[0] > tail[0] ? tail[0] + 1 : newHead[0] + 1;
        }
      }
    } else {
      if(vectorDist > 2.23) {
        newTail[0] += newHead[0] > tail[0] ? 1 : -1;
        newTail[1] += newHead[1] > tail[1] ? 1 : -1;
      }
    }
    newKnots[i] = newHead;
    
  }
  console.log(knots[9]);
  
  if(!uniqueSteps.has(JSON.stringify(knots[9]))) uniqueSteps.add(JSON.stringify(knots[9]));
  return [newKnots, uniqueSteps];
}

const process = (steps: string[]) => {
  let head = [0, 0];
  let tail = [0, 0];
  let uniqueSteps = new Set();

  steps.forEach(step => {
    const [ direction, count ] = step.split(' ');
    for(let i = 0; i < parseInt(count); i++) {
      const [newHead, newTail, steps] = move(direction, head, tail);
      head = newHead;
      tail = newTail;
      uniqueSteps = new Set([...uniqueSteps, ...steps]);
    }
  })
  return uniqueSteps.size;
}

const processPart2 = (steps: string[]) => {
  let knots = [...Array(10)].map(_ => [0, 0]);
  let uniqueSteps = new Set();

  steps.forEach(step => {
    const [ direction, count ] = step.split(' ');
    for(let i = 0; i < parseInt(count); i++) {
      const [newKnots, steps] = movePart2(direction, knots);
      knots = [...newKnots];
      uniqueSteps = new Set([...uniqueSteps, ...steps]);
      }
  })
  return uniqueSteps.size;
}


const first = (arr: string[]) => {
  const result = process(arr);
  console.log(result);
  return result;
};

const second = (arr: string[]) => {
  const result = processPart2(arr);
  console.log(result);
  return result;
};

const data = getDataAsArray(getFileContent('example.txt'));
console.assert(first(data) === 6011, 'Not matching first part');
console.assert(second(data) === 0, 'Not matching second part');
