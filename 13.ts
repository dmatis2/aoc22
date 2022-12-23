import { getFileContent, getDataAsArray } from './utils.js';

const first = (arr: string[]) => {
  let sum = 0;
  for(let i = 0; i < arr.length; i+=3) {
    const [ left, right ] = [JSON.parse(arr[i]), JSON.parse(arr[i+1])];
    console.log('---START---', left, right);

    let isInRightOrder = true;
    if(left.length > right.length) {
      isInRightOrder = false;
      continue;
    }
    if(left.length < right.length) {
      sum += Math.floor(i / 3) + 1;
      continue;
    }
    
    const min = Math.min(left.length, right.length);
    for(let j = 0; j < min; j++) {
      if(Number.isInteger(left[j]) && Number.isInteger(right[j])) {
        const l = parseInt(left[j])
        const r = parseInt(right[j])
        if(l === r) {
          continue;
        }
        if(l > r) {
          isInRightOrder = false;
          break;
        }
      } else if(Array.isArray(left[j]) && Array.isArray(right[j])) {
        if(left[j].length < right[j].length) {
          break;
        }
        if(left[j].length > right[j].length) {
          isInRightOrder = false;
          break;
        }
        for(let k = 0; k < left[j].length; k++) {
          if(left[j][k] > right[j][k]) {
            isInRightOrder = false;
            break;
          }
        }
      } else {
        const l = Number.isInteger(left[j]) ? [left[j]] : left[j];
        const r = Number.isInteger(right[j]) ? [right[j]] : right[j];
        if(l[0] > r[0]) {
          isInRightOrder = false;
        }
      }
    }
    if(isInRightOrder) {
      sum += Math.floor(i / 3) + 1;
    }
    
  }
  console.log(sum);
  const result = 0;
  console.log(result);
  return result;
};

const second = (arr: string[]) => {
  const result = 0;
  console.log(result);
  return result;
};

const data = getDataAsArray(getFileContent('input.txt'));
console.assert(first(data) === 0, 'Not matching first part');
console.assert(second(data) === 0, 'Not matching second part');
