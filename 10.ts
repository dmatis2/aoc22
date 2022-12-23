import { getFileContent, getDataAsArray } from './utils.js';

interface CPU {
  cycle: number
  X: number
}

type Command = "noop" | "addx"

interface Instruction {
  command: Command
  arg?: number
}

const isExpectedCycle = (cpu: CPU) => {
  if(cpu.cycle === 20) return true;
  if((cpu.cycle - 20) % 40 === 0) return true;
  return false;
}

const getSignalStrength = (cpu: CPU) => {
  if(isExpectedCycle(cpu)) {
    return cpu.cycle * cpu.X;
  }
  return 0;
}

const process = (arr: Instruction[]): number => {
  let cpu: CPU = {
    cycle: 0,
    X: 1
  }
  let totalStrength = 0;
  arr.forEach(ins => {
    if(ins.command === 'noop') {
      cpu.cycle += 1;
      totalStrength += getSignalStrength(cpu);
      return;
    }
    for(let i = 0; i < 2; i++) {
      cpu.cycle += 1;
      totalStrength += getSignalStrength(cpu);
      if(i === 1) cpu.X += ins.arg!;
    }
  });
  return totalStrength;
}

const first = (arr: Instruction[]) => {
  console.log(process(arr));
  
  const result = 0;
  console.log(result);
  return result;
};

const second = (arr: Instruction[]) => {
  const result = 0;
  console.log(result);
  return result;
};

const processInput = (arr: string[]): Instruction[] => {
  return arr.map(v => {
    if(v.startsWith('noop')) {
      return {
        command: "noop"
      } as Instruction;
    }
    const [cmd, arg] = v.split(' ');
    return {
      command: cmd,
      arg: parseInt(arg)
    } as Instruction;
  });
}

const data = getDataAsArray(getFileContent('input.txt'));
console.assert(first(processInput(data)) === 0, 'Not matching first part');
console.assert(second(processInput(data)) === 0, 'Not matching second part');
