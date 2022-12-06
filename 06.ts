import { getFileContent } from './utils.js';

const isDifferent = (str: string, startIndex: number, count: number = 4) => {
  const arr = str.split('').slice(startIndex, startIndex + count);
  if(arr.length === new Set(arr).size) return true;
  return false;
}

const first = (str: string) => {
  for(let i = 0; i < str.length - 4; i++) {
    if(isDifferent(str, i)) {
      const result = i + 4;
      console.log(result);
      return result;
    }
  }
  return -1;
};

const second = (str: string) => {
  for(let i = 0; i < str.length - 4; i++) {
    if(isDifferent(str, i, 14)) {
      const result = i + 14;
      console.log(result);
      return result;
    }
  }
  return -1;
};

const data = getFileContent('input.txt');
console.assert(first(data) === 1582, 'Not matching first part');
console.assert(second(data) === 3588, 'Not matching second part');
