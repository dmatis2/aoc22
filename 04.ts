import { getFileContent, getDataAsArray } from './utils.js';

const getPriority = (letter: string) => {
  if(letter.toLowerCase() === letter) {
    return 1 + letter.charCodeAt(0) - 'a'.charCodeAt(0);
  }
  return 27 + letter.charCodeAt(0) - 'A'.charCodeAt(0); 
}

const appearsInBothHalves = (arr: string[]) => {
  return arr.reduce((acc, l) => acc + getPriority(l.slice(l.length / 2).split('').filter(m => l.slice(0, l.length / 2).includes(m))[0]), 0);
}

const appearsInAllThree = (arrSlice: string[]) => {
  return getPriority([...new Set(arrSlice[0].split('').filter(l => arrSlice[1].split('').includes(l) && arrSlice[2].split('').includes(l)))][0]);
}

const first = (arr: string[]) => {
  const result = appearsInBothHalves(arr);
  console.log(result);
  return result;
};

const second = (arr: string[]) => {
  let result = 0;
  for(let i = 0; i < arr.length; i+=3) {
    result += appearsInAllThree(arr.slice(i, i+3));
  }
  console.log(result);
  return result;
};

const data = getDataAsArray(getFileContent('input.txt'));
console.assert(first(data) === 7875, 'Not matching first part');
console.assert(second(data) === 2479, 'Not matching second part');
