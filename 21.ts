import { getFileContent, getDataAsArray } from './utils.js';

interface Monkey {
  name: string
  number: number | null
  job: string | null
}

const parseInput = (arr: string[], isPart1 = true) => {
  const map = new Map<string, Monkey>();
  arr.forEach(monkey => {
    const [ name, jobOrNumber ] = monkey.split(': ');
    let parsed = parseInt(jobOrNumber);
    let number = Number.isNaN(parsed) ? null : parsed;
    let job = Number.isNaN(parsed) ? ((!isPart1 && name === 'root') ? jobOrNumber.replace(/(\+|\-|\*|\/)/, '===') : jobOrNumber) : null;
    let monkeyObj: Monkey = {
      name,
      number,
      job
    }
    map.set(name, monkeyObj)
  })
  return map;
}

const buildReferenceMap = (map: Map<string, Monkey>) => {
  const referenceMap = new Map<string, string[]>();
  [...map.keys()].forEach(key => {
    const tmp = map.get(key)!;
    if(tmp.job !== null) {
      const [left, _op, right] = tmp.job.split(' ');

      if(!referenceMap.has(key)) referenceMap.set(key, []);
      if(!referenceMap.has(left)) referenceMap.set(left, []);
      if(!referenceMap.has(right)) referenceMap.set(right, []);
      
      referenceMap.set(key, [...referenceMap.get(key)!, left, right])
      referenceMap.set(left, [...referenceMap.get(left)!, key])
      referenceMap.set(right, [...referenceMap.get(right)!, key])
    }
  })
  return referenceMap;
}

const processMap = (map: Map<string, Monkey>) => {
  const tmpMap = new Map(map);
  let stack: Monkey[] = [tmpMap.get('root')!];
  while(stack.length > 0) {
    let currentMonkey = stack.pop()!;
    if(currentMonkey.number !== null) {
      continue;
    }
    const [ left, op, right ] = currentMonkey.job!.split(' ');
    let leftMonkey = tmpMap.get(left)!
    let rightMonkey = tmpMap.get(right)!
    if(leftMonkey.number !== null && rightMonkey.number !== null) {
      eval(`currentMonkey.number = leftMonkey.number ${op} rightMonkey.number`)
      tmpMap.set(currentMonkey.name, currentMonkey);
      continue;
    }
    stack.push(currentMonkey);
    if(leftMonkey.number === null) {
      stack.push(leftMonkey)
    }
    if(rightMonkey.number === null) {
      stack.push(rightMonkey)
    }
  }
  return tmpMap;
}

const jobBuilderByReference = (map: Map<string, Monkey>, referenceMap: Map<string, string[]>) => {
  const tmpMap = new Map(map);
  let stack: Monkey[] = [tmpMap.get('humn')!];
  let alreadyVisited = new Set<string>();
  while(stack.length > 0) {
    let currentMonkey = stack.pop()!;
    if(alreadyVisited.has(currentMonkey.name)) continue;
    alreadyVisited.add(currentMonkey.name);
    // console.log(currentMonkey);
    
    let newReferences = referenceMap.get(currentMonkey.name)!;
    let buildStr = currentMonkey.job === null ? '(humn)' : currentMonkey.job;
    newReferences.forEach(ref => {
      let changing = tmpMap.get(ref)!
      if(changing.job === null) return;
      
      changing.job = changing.job!.replace(ref, `(${buildStr})`);
      tmpMap.set(ref, changing);
      stack.push(tmpMap.get(ref)!);
    });
  }
  return tmpMap;
}

const first = (arr: string[]) => {
  const map = processMap(parseInput(arr));
  const result = map.get('root')?.number;
  console.log(result);
  return result;
};

const second = (arr: string[]) => {
  const map = parseInput(arr, false);
  let count = 0;
  let stack = ['root'];
  let completed: string[] = [];
  [...map.keys()].forEach(key => {
    const tmp = map.get(key)!;
    map.set(key, {...map.get(key)!, job: tmp.job ? tmp.job!.replace(/([a-z]+)/g, `($1)`) : null})
  });
  console.log(map);

  while(stack.length > 0) {
    let curName = stack.pop()!;
    console.log("🚀 ~ file: 21.ts:116 ~ second ~ stack", stack)
    if(completed.includes(curName)) continue;
    let curObj = map.get(curName)!;
    console.log("🚀 ~ file: 21.ts:118 ~ second ~ curObj", curObj)
    if(curObj.job) {
      let areNumbers = curObj.job.match(/\d+/g)
      if(areNumbers) {
        if(areNumbers.length === 1) {
          completed.push(curName);
          continue;
        }
        if(areNumbers.length === 2) {
          let solution = 0;
          eval(`solution = ${curObj.job}`);
          map.set(curName, {...map.get(curName)!, job: `(${solution})`})
          continue;
        }
      }
      let matches: string[] | null = curObj.job.match(/[a-z]+/g)
      if(!matches) continue;
      matches = matches.filter(m => m !== 'humn')
      let willGoToStack: string[] = [];
      matches.forEach(match => {
        const num = map.get(match)!.number
        const job = map.get(match)!.job!
        console.log("🚀 ~ file: 21.ts:140 ~ second ~ job", job)
        if(num) {
          map.set(curName, {...map.get(curName)!, job: map.get(curName)!.job!.replace(match, `${num}`)})
        } else if(!Number.isNaN(parseInt(job))) {
          map.set(curName, {...map.get(curName)!, job: map.get(curName)!.job!.replace(match, `${job}`)})
        } else {
          willGoToStack.unshift(match);
        }
      })
      if(willGoToStack.length > 0) {
        stack.push(curName);
        willGoToStack.forEach(match => stack.push(match));
      }
    }
  }

  console.log(map);
  
  return 0;
  
};

const data = getDataAsArray(getFileContent('example.txt'));
console.assert(first(data) === 0, 'Not matching first part');
console.assert(second(data) === 0, 'Not matching second part');
