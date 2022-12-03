import { getFileContent, getDataAsArray } from './utils.js';

const first = (arr: string[]) => {
  let max = Number.NEGATIVE_INFINITY;
  let current = 0;
  arr.forEach(line => {
    if(line === '') {
      if(current > max) max = current;
      current = 0;
      return;
    }
    current += parseInt(line);
  })
  const result = max;
  console.log(result);
  return result;
};

const second = (arr: string[]) => {
  let elves: number[] = [];
  let current = 0;
  arr.forEach(line => {
    if(line === '') {
      elves.push(current);
      current = 0;
      return;
    }
    current += parseInt(line);
  })
  elves.sort((a,b) => b-a);
  const result = elves.slice(0, 3).reduce((a,v) => a + v, 0);
  console.log(result);
  return result;
};

const data = getDataAsArray(getFileContent('input.txt'));
console.assert(first(data) === 71300, 'Not matching first part');
console.assert(second(data) === 209691, 'Not matching second part');
