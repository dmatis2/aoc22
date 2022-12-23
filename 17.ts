import { getFileContent, getDataAsArray } from './utils.js';

const shapes = [
  [[0, 0], [1, 0], [2, 0], [3, 0]],
  [[0, 0], [1, 0], [2, 0], [1, 1], [1, -1]],
  [[0, -1], [1, -1], [2, -1], [2, 0], [2, 1]],
  [[0, 0], [0, -1], [0, -2], [0, -3]],
  [[0, 0], [0, -1], [1, 0], [1, -1]]
]

const first = (jetPattern: string) => {
  let chamber: string[] = [];
  let prevShape = 0;
  let currentShape = 0;
  let currentJet = 0;
  let placedRocks = 0;
  let highestFloor = 0;

  while(placedRocks !== 5) {
    const shapesMin = Math.min(...shapes[currentShape].map(s => s[1]))
    let currentShapePosition = shapes[currentShape].map(s => [s[0] + 2, s[1] + Math.abs(shapesMin) + 3 + highestFloor]);
    console.log('---STARTING FROM---', currentShapePosition);
    let newShapePosition = currentShapePosition;
    while(true) {
      const tmp = newShapePosition.map(s => [s[0] + (jetPattern[currentJet] === '<' ? -1 : 1), s[1] - 1])
      if(tmp.some(p => p[0] < 0 || p[0] > 6)) {
        newShapePosition = newShapePosition.map(s => [s[0], s[1] - 1]);
      } else { 
        newShapePosition = tmp;
      }      
      currentJet = (currentJet + 1) % jetPattern.length;
      
      if(newShapePosition.some(p => p[1] === -1) || newShapePosition.some(p => chamber.includes(JSON.stringify(p)))) {
        placedRocks++;
        currentShape = (currentShape + 1) % 5;
        chamber = [...chamber, ...newShapePosition.map(p => JSON.stringify([p[0], p[1] + 1]))]
        console.log('placed rock number', placedRocks, 'to', newShapePosition.map(p => [p[0], p[1] + 1]));
        const ys = shapes[prevShape].map(s => s[1] + 1);
        prevShape = (prevShape + 1) % 5;
        highestFloor = 1 + highestFloor + Math.max(...ys) - Math.min(...ys);
        break;
      }
    }
  }

  
  const result = 0;
  console.log(result);
  return result;
};

const second = (jetPattern: string) => {
  const result = 0;
  console.log(result);
  return result;
};

const data = getFileContent('example.txt');
console.assert(first(data) === 0, 'Not matching first part');
console.assert(second(data) === 0, 'Not matching second part');
