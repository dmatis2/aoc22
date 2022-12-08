import { getFileContent, getDataAsArray } from './utils.js';

const getCircumference = (arr: string[]) => {
  return 2 * arr.length + 2 * arr[0].length - 4;
}

const getDimensions = (arr: string[]) => {
  return [arr.length, arr[0].length];
}

const getVisibleCount = (arr: string[]) => {
  const [ rows, cols ] = getDimensions(arr);
  let count = 0;
  for(let y = 1; y < rows - 1; y++) {
    for(let x = 1; x < cols - 1; x++) {
      if(isVisible(arr, y, x)) count++;
    }
  }
  return count;
}

const getMaxScenicScore = (arr: string[]) => {
  const [ rows, cols ] = getDimensions(arr);
  let max = Number.NEGATIVE_INFINITY;
  for(let y = 1; y < rows - 1; y++) {
    for(let x = 1; x < cols - 1; x++) {
      const score = getTreesScenicScore(arr, y, x);
      if(score > max) max = score;
    }
  }
  return max;
}

const isVisible = (arr: string[], posY: number, posX: number) => {
  let current = arr[posY][posX];
  let isHighestInTotal = 0;
  let isCurrentlyHighest = 1;
  
  for(let y = 0; y < posY; y++) {
    if(arr[y][posX] >= current) isCurrentlyHighest = 0;
  }
  isHighestInTotal += isCurrentlyHighest;

  isCurrentlyHighest = 1;
  for(let y = posY + 1; y < arr[0].length; y++) {
    if(arr[y][posX] >= current) isCurrentlyHighest = 0;
  }
  isHighestInTotal += isCurrentlyHighest;

  isCurrentlyHighest = 1;
  for(let x = 0; x < posX; x++) {
    if(arr[posY][x] >= current) isCurrentlyHighest = 0;
  }
  isHighestInTotal += isCurrentlyHighest;

  isCurrentlyHighest = 1;
  for(let x = posX + 1; x < arr.length; x++) {
    if(arr[posY][x] >= current) isCurrentlyHighest = 0;
  }
  isHighestInTotal += isCurrentlyHighest;

  return isHighestInTotal > 0;
}

const getTreesScenicScore = (arr: string[], posY: number, posX: number) => {
  let current = arr[posY][posX];
  let [t, d, l, r] = [0, 0, 0, 0];
  for(let y = posY - 1; y >= 0; y--) {
    t++;
    if(arr[y][posX] >= current) break;
  }
  for(let y = posY + 1; y < arr[0].length; y++) {
    d++;
    if(arr[y][posX] >= current) break;
  }
  for(let x = posX - 1; x >= 0; x--) {
    l++;
    if(arr[posY][x] >= current) break;
  }

  for(let x = posX + 1; x < arr.length; x++) {
    r++;
    if(arr[posY][x] >= current) break;
  }

  return t * l * d * r;
}

const first = (arr: string[]) => {
  const result = getCircumference(arr) + getVisibleCount(arr);
  console.log(result);
  return result;
};

const second = (arr: string[]) => {
  const result = getMaxScenicScore(arr);
  console.log(result);
  return result;
};

const data = getDataAsArray(getFileContent('input.txt'));
console.assert(first(data) === 1796, 'Not matching first part');
console.assert(second(data) === 288120, 'Not matching second part');
