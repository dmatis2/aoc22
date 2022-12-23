import { getFileContent, getDataAsArray } from './utils.js';

const c = (char: string) => char.charCodeAt(0);

const BFS = (root: number[], target: number[], arr: string[]) => {
  const queue: string[] = [JSON.stringify(root)];
  const visited = new Set<string>();
  const steps = new Map<string, number>();
  steps.set(JSON.stringify(root), 0);

  while(queue.length > 0) {
    const current: string = queue.shift()!;
    const parsed = JSON.parse(current) as number[];
    const currentHeight = current === JSON.stringify(root) ? c('a') : c(arr[parsed[0]][parsed[1]]);
    if(visited.has(current)) continue;
    visited.add(current);

    if(current === JSON.stringify(target)) {
      return steps.get(current)!;
    }
    
    const locations = [[-1, 0], [0, -1], [0, 1], [1, 0]];
    const [y, x] = JSON.parse(current) as number[];
    locations.forEach(loc => {
      try {
        const [newY, newX] = [y + loc[0], x + loc[1]];
        const newHeight = arr[newY][newX] === 'E' ? c('z') : c(arr[newY][newX]);
        if(newHeight > (currentHeight + 1)) return;
        const strPos = JSON.stringify([newY, newX]);
        queue.push(strPos);
        if(!steps.has(strPos)) steps.set(strPos, steps.get(current)! + 1);
      } catch (e) {}
  })
  }
  return -1;
}

const BFSToNearestA = (root: number[], arr: string[]) => {
  const queue: string[] = [JSON.stringify(root)];
  const visited = new Set<string>();
  const steps = new Map<string, number>();
  steps.set(JSON.stringify(root), 0);

  while(queue.length > 0) {
    const current: string = queue.shift()!;
    const parsed = JSON.parse(current) as number[];
    const currentHeight = current === JSON.stringify(root) ? c('z') : c(arr[parsed[0]][parsed[1]]);
    if(visited.has(current)) continue;
    visited.add(current);

    if(arr[parsed[0]][parsed[1]] === 'a') {
      return steps.get(current)!;
    }
    
    const locations = [[-1, 0], [0, -1], [0, 1], [1, 0]];
    const [y, x] = JSON.parse(current) as number[];
    locations.forEach(loc => {
      try {
        const [newY, newX] = [y + loc[0], x + loc[1]];
        const newHeight = arr[newY][newX] === 'E' ? c('z') : c(arr[newY][newX]);
        if(newHeight < (currentHeight - 1)) return;
        const strPos = JSON.stringify([newY, newX]);
        queue.push(strPos);
        if(!steps.has(strPos)) steps.set(strPos, steps.get(current)! + 1);
      } catch (e) {}
  })
  }
  return -1;
}

const first = (arr: string[]) => {
  let start = [0, 0]
  let end = [0, 0]

  for(let row = 0; row < arr.length; row++) {
    for(let col = 0; col < arr[row].length; col++) {
      if(arr[row][col] === 'S') start = [row, col]
      if(arr[row][col] === 'E') end = [row, col]
    }
  }

  const result = BFS(start, end, arr);
  console.log(result);
  return result;
};

const second = (arr: string[]) => {
  let start = [0, 0]
  let end = [0, 0]

  for(let row = 0; row < arr.length; row++) {
    for(let col = 0; col < arr[row].length; col++) {
      if(arr[row][col] === 'S') start = [row, col]
      if(arr[row][col] === 'E') end = [row, col]
    }
  }

  const result = BFSToNearestA(end, arr);
  console.log(result);
  return result;
};

const data = getDataAsArray(getFileContent('input.txt'));
console.assert(first(data) === 468, 'Not matching first part');
console.assert(second(data) === 459, 'Not matching second part');
