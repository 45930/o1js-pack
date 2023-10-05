import { AgeGateCircuit } from './non-packed-circuit.js';
import { CircuitString } from 'o1js';

console.time('Compiling...');
await AgeGateCircuit.compile();
console.timeEnd('Compiling...');

console.time('Running...');
let old_proof = await AgeGateCircuit.init();
old_proof = await AgeGateCircuit.verifyAge(
  old_proof,
  CircuitString.fromString('20210927')
);
old_proof = await AgeGateCircuit.verifyAge(
  old_proof,
  CircuitString.fromString('19011225')
);
old_proof = await AgeGateCircuit.verifyAge(
  old_proof,
  CircuitString.fromString('20071031')
);
console.timeEnd('Running...');

// Now we expect old_proof to have a counter of [2, 1] - 2 dates were older than 2000-01-01, 1 date was younger
const counters = old_proof.publicOutput;
console.log(counters.toString());

const circuitAnalysis = AgeGateCircuit.analyzeMethods();
console.log('Number of gates in method 0: ', circuitAnalysis[0].rows);
console.log('Number of gates in method 1: ', circuitAnalysis[1].rows);

// Compiling...: 1:00.331 (m:ss.mmm)
// Running...: 3:31.711 (m:ss.mmm)
// 2,1
// Number of gates in method 0:  0
// Number of gates in method 1:  651
