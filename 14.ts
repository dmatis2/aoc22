import { getFileContent, getDataAsArray } from './utils.js';

interface Position {
  x: number
  y: number
}

const getSlope = (point1: Position, point2: Position): number => {
  const { x: x1 } = point1;
  const { x: x2 } = point2;
  if(x1 === x2) return 0;
  return 1;
}

const getPositions = (rock: string[]): Position[] => {
  return rock.map(r => {
    const [x, y] = r.split(',');
    return {
      x: parseInt(x),
      y: parseInt(y)
    }
  })
}

const processRock = (rock: string[]) => {
  const rockPositions = getPositions(rock);
  let rocks: string[] = [];
  for(let i = 0; i < rockPositions.length - 1; i++) {
    const [ p1, p2 ] = [rockPositions[i], rockPositions[i+1]];
    const slope = getSlope(p1, p2);
    if(slope === 0) {
      const [min, max] = [Math.min(p1.y, p2.y), Math.max(p1.y, p2.y)]
      for(let j = min; j <= max; j++) {
        const str = `${p1.x},${j}`;
        if(!rocks.includes(str)) {
          rocks.push(str);
        }
      }
      continue;
    }
    const [min, max] = [Math.min(p1.x, p2.x), Math.max(p1.x, p2.x)]
    for(let j = min; j <= max; j++) {
      const str = `${j},${p1.y}`;
      if(!rocks.includes(str)) {
        rocks.push(str);
      }
    }
  }
  return rocks;
}

const getListOfRocks = (arr: string[]) => {
  return arr.flatMap(rock => processRock(rock.split(' -> ')));
}

const getMaxDepth = (rocks: string[]) => {
  let maxDepth = Number.NEGATIVE_INFINITY;
  rocks.forEach(rock => {
    const y = parseInt(rock.split(',')[1]);
    if(y > maxDepth) maxDepth = y;
  })
  return maxDepth;
}

const pourSand = (rocks: string[], maxDepth: number) => {
  let sandPositions: string[] = [];
  let initialPosition: Position = {x: 500, y: 0}
  while(true) {
     let current = JSON.parse(JSON.stringify(initialPosition));
     while(true) {
      if(current.y + 1 > maxDepth) {
        return sandPositions.length;
      }
      const nextPosDown = `${current.x},${current.y+1}`;
      const nextPosDownLeft = `${current.x-1},${current.y+1}`;
      const nextPosDownRight = `${current.x+1},${current.y+1}`;
      if(!sandPositions.includes(nextPosDown) && !rocks.includes(nextPosDown)) {
        current.y += 1;
        continue;
      }
      if(!sandPositions.includes(nextPosDownLeft) && !rocks.includes(nextPosDownLeft)) {
        current.y += 1;
        current.x -= 1;
        continue;
      }
      if(!sandPositions.includes(nextPosDownRight) && !rocks.includes(nextPosDownRight)) {
        current.y += 1;
        current.x += 1;
        continue;
      }
      sandPositions.push(`${current.x},${current.y}`);
      break;
     }
  }
}

const pourSandPart2 = (rocks: string[], maxDepth: number) => {
  let sandPositions: string[] = [...rocks];
  let initialPosition: Position = {x: 500, y: 0}
  while(true) {
      if(sandPositions.length % 1000 === 0) console.log(sandPositions.length);
     let current = JSON.parse(JSON.stringify(initialPosition));
     if(sandPositions.includes(`500,1`)) return sandPositions.length - rocks.length;
     while(true) {
      if(current.y === maxDepth + 2) {
        // console.log('Placed on the floor');
        sandPositions.push(`${current.x},${current.y}`);
        break;
      }
      if(!sandPositions.includes(`${current.x},${current.y+1}`)) {
        current.y += 1;
        continue;
      }
      if(!sandPositions.includes(`${current.x-1},${current.y+1}`)) {
        current.y += 1;
        current.x -= 1;
        continue;
      }
      if(!sandPositions.includes(`${current.x+1},${current.y+1}`)) {
        current.y += 1;
        current.x += 1;
        continue;
      }
      // console.log(`Cannot move more, placing on [${current.x},${current.y}]`);
      sandPositions.push(`${current.x},${current.y}`);
      break;
     }
  }
}


const first = (arr: string[]) => {
  const listOfRocks = getListOfRocks(arr);
  const maxDepth = getMaxDepth(listOfRocks);
  const result = pourSand(listOfRocks, maxDepth);
  console.log(result);
  return result;
};

const second = (arr: string[]) => {
  const listOfRocks = getListOfRocks(arr);
  const maxDepth = getMaxDepth(listOfRocks);
  const result = pourSandPart2(listOfRocks, maxDepth);
  console.log(result);
  return result;
};

const getUniqueRockPaths = (arr: string[]): string[] => {
  return [...new Set(arr)]
}

const data = getUniqueRockPaths(getDataAsArray(getFileContent('input.txt')));
console.assert(first(data) === 1199, 'Not matching first part');
console.assert(second(data) === 0, 'Not matching second part');
