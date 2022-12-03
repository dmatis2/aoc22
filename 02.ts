import { getFileContent, getDataAsArray } from './utils.js';

type P1 = 'A' | 'B' | 'C'
type P2 = 'X' | 'Y' | 'Z'
type EndState = 'X' | 'Y' | 'Z'

const draw = {
  'A': 'X',
  'B': 'Y',
  'C': 'Z'
}
const winning = {
  'A': 'Y',
  'B': 'Z',
  'C': 'X'
}
const losing = {
  'A': 'Z',
  'B': 'X',
  'C': 'Y'
}

const scores = {
  'X': 1,
  'Y': 2,
  'Z': 3
}

const roundCount = {
  'X': 0,
  'Y': 3,
  'Z': 6
}

const processGamesP1 = (arr: string[]) => {
  let score = 0
  arr.forEach(game => {
    const p1 = game[0] as P1
    const p2 = game[2] as P2
    if(p2 === draw[p1]) {
      score += 3 + scores[p2]
      return;
    }
    if(p2 === winning[p1]) {
      score += 6 + scores[p2]
      return
    }
    score += 0 + scores[p2]
  })
  return score
}

const processGamesP2 = (arr: string[]) => {
  let score = 0
  arr.forEach(game => {
    const p1 = game[0] as P1
    const end = game[2] as EndState
    let p2 = 'X' as P2;
    if(end === 'X') {
      p2 = losing[p1] as P2
    } else if(end === 'Y') {
      p2 = <P2> draw[p1] 
    } else {
      p2 = <P2> winning[p1]
    }
    score += roundCount[end] + scores[p2]
  })
  return score
}

const first = (arr: string[]) => {
  const result = processGamesP1(arr);
  console.log(result);
  return result;
};

const second = (arr: string[]) => {
  const result = processGamesP2(arr);
  console.log(result);
  return result;
};

const data = getDataAsArray(getFileContent('input.txt'));
console.assert(first(data) === 14069, 'Not matching first part');
console.assert(second(data) === 12411, 'Not matching second part');
