import { getFileContent, getDataAsArray } from './utils.js';

const parseInput = (arr: string[]) => {
  const map = new Map();
  arr.forEach(val => {
    map.set(val, 6);
  });
  return map;
}

const getMinMax = (arr: string[]) => {
  let [minX, maxX] = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];
  let [minY, maxY] = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];
  let [minZ, maxZ] = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];
  arr.forEach(val => {
    const [x,y,z] = val.split(',');
    if(parseInt(x) < minX) minX = parseInt(x);
    if(parseInt(y) < minY) minY = parseInt(y);
    if(parseInt(z) < minZ) minZ = parseInt(z);
    if(parseInt(x) > maxX) maxX = parseInt(x);
    if(parseInt(y) > maxY) maxY = parseInt(y);
    if(parseInt(z) > maxZ) maxZ = parseInt(z);
  });
  return [minX, maxX, minY, maxY, minZ, maxZ];
}

const first = (arr: string[]) => {
  const map = parseInput(arr);
  for(let i = 0; i < arr.length - 1; i++) {
    for(let j = i + 1; j < arr.length; j++) {
      const p1 = arr[i].split(',').map(s => parseInt(s));
      const p2 = arr[j].split(',').map(s => parseInt(s));
      let matching = 0;
      let maxDist = 0;
      for(let k = 0; k < p1.length; k++) {
        
        if(p1[k] === p2[k]) {
          matching++;
        } else {
          maxDist = Math.max(p1[k], p2[k]) - Math.min(p1[k], p2[k]);
        }
      }
      if(matching === 2 && maxDist === 1) {
        map.set(arr[i], map.get(arr[i]) - 1);
        map.set(arr[j], map.get(arr[j]) - 1);
      }
    }
  }

  console.log([...map.values()].reduce((a,v) => a + v, 0));
  
  
  const result = 0;
  console.log(result);
  return result;
};

const doDFS = (arr: string[], coords: string) => {
  let stack = [coords];
  let visited = new Set();

  if(arr.includes(coords)) return false;

  while(stack.length) {
    const val = stack.pop()!;
    const coordsArr = val.split(',');
    if(arr.includes(val)) continue;
    for(let i = 0; i < 3; i++) {
      if(parseInt(coordsArr[i]) < 0 || parseInt(coordsArr[i]) > 20) return true;
    }
    if(visited.has(val)) continue;
    visited.add(val);
    for(let x = -1; x <= 1; x++) {
      for(let y = -1; y <= 1; y++) {
        for(let z = -1; z <= 1; z++) {
          stack.push([parseInt(coordsArr[0]) + x, parseInt(coordsArr[1]) + y, parseInt(coordsArr[2]) + z].join(','))
        }
      }
    }
  }
  return false;
}

const second = (arr: string[]) => {
  let count = 0;

  for(let i = 0; i < arr.length; i++) {
    for(let x = -1; x <= 1; x++) {
      for(let y = -1; y <= 1; y++) {
        for(let z = -1; z <= 1; z++) {
          const [x2, y2, z2] = arr[i].split(',');
          count += doDFS(arr, [parseInt(x2) + x, parseInt(y2) + y, parseInt(z2) + z].join(',')) ? 1 : 0;
        }
      }
    }
  }

  console.log(count);
  
  
  const result = 0;
  console.log(result);
  return result;
};

const data = getDataAsArray(getFileContent('input.txt'));
console.assert(first(data) === 0, 'Not matching first part');
console.assert(second(data) === 0, 'Not matching second part');
