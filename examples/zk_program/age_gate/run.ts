import { AgeGateCircuit, PackedCounters, PackedString } from './circuit.js';

console.time('Compiling...');
await AgeGateCircuit.compile();
console.timeEnd('Compiling...');

console.time('Running...');
let old_proof = await AgeGateCircuit.init();
old_proof = await AgeGateCircuit.verifyAge(
  old_proof,
  PackedString.fromString('20210927')
);
old_proof = await AgeGateCircuit.verifyAge(
  old_proof,
  PackedString.fromString('19011225')
);
old_proof = await AgeGateCircuit.verifyAge(
  old_proof,
  PackedString.fromString('20071031')
);
console.timeEnd('Running...');

// Now we expect old_proof to have a counter of [2, 1] - 2 dates were older than 2000-01-01, 1 date was younger
const counters = PackedCounters.unpack(old_proof.publicOutput.packed);
console.log(counters.toString());

const circuitAnalysis = AgeGateCircuit.analyzeMethods();
console.log('Number of gates in method 0: ', circuitAnalysis[0].rows);
console.log('Number of gates in method 1: ', circuitAnalysis[1].rows);

// Compiling...: 59.405s
// Running...: 3:31.839 (m:ss.mmm)
// 2,1
// Number of gates in method 0:  0
// Number of gates in method 1:  551
