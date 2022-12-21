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
  const map = processMap(parseInput(arr, false));
  const queue: string[] = [...map.keys()];

  const builtStrings = new Map<string, string | null>();

  while(queue.length > 0) {
    const curr = queue.shift()!;
    if(curr === 'humn') continue;
    if(!builtStrings.has(curr)) {
      const { job, number } = map.get(curr)!;
      builtStrings.set(curr, job ? job : number!.toString());
      queue.push(curr);
      continue;
    }
    const matches = builtStrings.get(curr)!.match(/[a-z]+/g)!;
    let newStr = builtStrings.get(curr)!;
    if(matches && matches.length === 1 && matches[0] === 'humn') {
      // only 'humn' var inside, this is final
      continue;
    } else if(matches && matches.length > 1) {
      // two vars are there, we need to check them if they are numbers or not
      const [ l, r ] = matches.slice(0, 2);
      if(l !== 'humn' && builtStrings.has(l)) {
        const parsed = parseInt(builtStrings.get(l)!)
        if(!Number.isNaN(parsed)) {
          newStr = newStr.replace(l, `(${parsed})`)
          builtStrings.set(curr, newStr);
        } else {
          queue.push(l);
          queue.push(curr);
        }
      } else if(r !== 'humn' && builtStrings.has(r)) {
        const parsed = parseInt(builtStrings.get(r)!)
        if(!Number.isNaN(parsed)) {
          newStr = newStr.replace(r, `(${parsed})`)
          builtStrings.set(curr, newStr);
        } else {
          queue.push(r);
          queue.push(curr);
        }
      } else {
        queue.push(l)
        queue.push(r)
        queue.push(curr)
      }
    } else if(!matches) {
      // no vars are there, check if it is a number or calculate solution
      const c = builtStrings.get(curr)!;
      if(Number.isNaN(parseInt(c))) {
        console.log('need to calculate', c);
        const matches = builtStrings.get(curr)!.match(/[a-z]+/g)!;
        const operand = builtStrings.get(curr)!.match(/(\+|\-|\*|\/)/)!;
        const [ l, r ] = matches.slice(0, 2);
        const leftParsed = parseInt(builtStrings.get(l)!)
        const rightParsed = parseInt(builtStrings.get(r)!)
        let solution = 0;
        if(!Number.isNaN(leftParsed) && !Number.isNaN(rightParsed)) {
          eval(`solution = ${leftParsed} ${operand} ${rightParsed}`);
          builtStrings.set(curr, `(${solution})`);
        }
        else if(l !== 'humn' && Number.isNaN(leftParsed)) {
          queue.push(l);
          queue.push(curr);
        } else if(r !== 'humn' && Number.isNaN(rightParsed)) {
          queue.push(r);
          queue.push(curr);
        }
      } 
    }
  }
  console.log(builtStrings);
  

  // while(queue.length > 0) {
  //   const curr = queue.shift()!;
  //   if(builtStrings.has(curr)) {
  //     const matches = builtStrings.get(curr)!.match(/\[a-z]+/g)!;
  //     if(matches && matches.length === 1 && matches[0] === 'humn') {
  //       continue;
  //     }
  //     matches.every(match => )
  //     queue.push(curr);
  //     continue;
  //   }
  // }
  
  // let built = referenceMap.get('root')!.job!;
  let built = "25 + 15";
  let needProcessing = true;
  while(needProcessing) {
    const matches = built.match(/\[a-z]+/g)
    if(!matches) {
      needProcessing = false;
      break;
    }
    matches.forEach(match => {

    })
  }
  // const built = jobBuilderByReference(map, referenceMap);
  // console.log(built);
  // let jobBuilt = built.get('root')!.job;
  
  const result = 0;
  console.log(result);
  return result;
};

const data = getDataAsArray(getFileContent('example.txt'));
console.assert(first(data) === 0, 'Not matching first part');
console.assert(second(data) === 0, 'Not matching second part');
