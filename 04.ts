import { getFileContent, getDataAsArray } from './utils.js';
interface Section {
  firstFrom: number;
  firstTo: number;
  secondFrom: number;
  secondTo: number;
}

const parseInput = (arr: string[]): Section[] => {
  const regex = /(?<firstFrom>\d+)\-(?<firstTo>\d+),(?<secondFrom>\d+)\-(?<secondTo>\d+)/;
  return arr.map(line => {
    const { firstFrom, firstTo, secondFrom, secondTo } = line.match(regex)?.groups!;
    return {
      firstFrom: parseInt(firstFrom),
      firstTo: parseInt(firstTo),
      secondFrom: parseInt(secondFrom),
      secondTo: parseInt(secondTo),
    }
  });
}

const isFullyContained = (pair: Section) => {
  const firstLength = pair.firstTo - pair.firstFrom;
  const secondLength = pair.secondTo - pair.secondFrom;
  if(firstLength >= secondLength) {
    return pair.firstFrom <= pair.secondFrom && pair.secondTo <= pair.firstTo;
  }
  return pair.secondFrom <= pair.firstFrom && pair.firstTo <= pair.secondTo;
}

const isPartiallyContained = (pair: Section) => {
  if(pair.firstFrom <= pair.secondFrom) {
    return pair.firstTo >= pair.secondFrom
  }
  return pair.secondTo >= pair.firstFrom
}


const first = (arr: Section[]) => {
  const result = arr.filter(pair => isFullyContained(pair)).length;
  console.log(result);
  return result;
};

const second = (arr: Section[]) => {
  const result = arr.filter(pair => isPartiallyContained(pair)).length;
  console.log(result);
  return result;
};

const data = parseInput(getDataAsArray(getFileContent('input.txt')));
console.assert(first(data) === 582, 'Not matching first part');
console.assert(second(data) === 893, 'Not matching second part');
