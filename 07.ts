import { getFileContent, getDataAsArray } from './utils.js';

const getPath = (pathArr: string[]) => pathArr.join('/');

const isFile = (line: string) => line.match(/^\d/);

const first = (arr: string[]) => {
  const map = new Map();
  let currentPath: string[] = [];
  arr.forEach(line => {
    if(line.startsWith('$ cd')) {
      const location = line.split(' ')[2];
      if(location === '..') {
        currentPath.pop();
        return;
      }
      if(location === '/') {
        currentPath = [''];
        if(!map.has(getPath(currentPath))) map.set(getPath(currentPath), 0);
        return;
      }
      currentPath = [...currentPath, location];
      if(!map.has(getPath(currentPath))) map.set(getPath(currentPath), 0);
      return;
    }
    if(isFile(line)) {
      const fileSize = parseInt(line.split(' ')[0]);
      const currentFullPath = getPath(currentPath);
      map.set(currentFullPath, map.get(currentFullPath) + fileSize);
      let tmpPath = [...currentPath];
      while(true) {
        if(tmpPath.length === 0) break;
        tmpPath.pop();
        const tmpFullPath = getPath(tmpPath);
        map.set(tmpFullPath, map.get(tmpFullPath) + fileSize);
      }
    }
  })
  const result = Array.from(map.values()).filter(x => x < 100000).reduce((a,v)=>a+v, 0);
  console.log(result);
  return result;
};

const second = (arr: string[]) => {
  const map = new Map();
  let currentPath: string[] = [];
  arr.forEach(line => {
    if(line.startsWith('$ cd')) {
      const location = line.split(' ')[2];
      if(location === '..') {
        currentPath.pop();
        return;
      }
      if(location === '/') {
        currentPath = [''];
        const currentFullPath = getPath(currentPath);
        if(!map.has(currentFullPath)) map.set(currentFullPath, 0);
        return;
      }
      currentPath = [...currentPath, location];
      const currentFullPath = getPath(currentPath);
      if(!map.has(currentFullPath)) map.set(currentFullPath, 0);
      return;
    }
    if(isFile(line)) {
      const fileSize = parseInt(line.split(' ')[0]);
      let tmpPath = [...currentPath];
      while(true) {
        if(tmpPath.length === 0) break;
        const currentFullPath = getPath(tmpPath);
        map.set(currentFullPath, map.get(currentFullPath) + fileSize);
        tmpPath.pop();
      }
    }
  })
  const sizes = Array.from(map.entries()).sort((a,b) => a[1] - b[1]).filter(x => x[1] >= 8381165);
  console.log(sizes);
  
  const result = 0;
  // console.log(result);
  return result;
};

const data = getDataAsArray(getFileContent('input.txt'));
console.assert(first(data) === 0, 'Not matching first part');
console.assert(second(data) === 0, 'Not matching second part');
