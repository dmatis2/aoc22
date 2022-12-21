import { getFileContent, getDataAsArray } from './utils.js';

const getIndex = (arr: number[], place: number) => {
  return (arr.indexOf(0) + place) % arr.length;
}

const parseInput = (arr: string[]) => arr.map(val => parseInt(val));

const first = (arr: number[]) => {
  let newArr = JSON.parse(JSON.stringify(arr))

  arr.forEach((current) => {
    let index = newArr.indexOf(current);
    newArr.splice(index, 1)
    let newIndex = -1;
    if(current < 0) {
      newIndex = index + current;
      if(newIndex < 0) {
        newIndex = arr.length - 1 + newIndex
      }
      else if(newIndex === 0) {
        newIndex = arr.length - 1;
      }
    } else {
      newIndex = (index + current) >= arr.length ? (index + current) % arr.length + 1 : index + current;
    }
    newArr = [...newArr.slice(0, newIndex), current, ...newArr.slice(newIndex)]
  });

  console.log('finished', newArr);
  const result = [1000, 2000, 3000].map(v => newArr[getIndex(newArr, v)]).reduce((a,v) => a+v, 0);
  console.log(result);
  return result;
};

const second = (arr: number[]) => {
  const result = 0;
  console.log(result);
  return result;
};

const data = parseInput(getDataAsArray(getFileContent('input.txt')));
console.assert(first(data) === 0, 'Not matching first part');
console.assert(second(data) === 0, 'Not matching second part');
