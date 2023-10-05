import { AccountUpdate, Mina, PrivateKey } from 'o1js';
import { Ballot, Election } from './contract.js';

let Local = Mina.LocalBlockchain({ proofsEnabled: true });
Mina.setActiveInstance(Local);

// a test account that pays all the fees, and puts additional funds into the zkapp
let { privateKey: senderKey, publicKey: sender } = Local.testAccounts[0];

// the zkapp account
let zkappKey = PrivateKey.random();
let zkappAddress = zkappKey.toPublicKey();

// a special account that is allowed to pull out half of the zkapp balance, once
let privilegedKey = PrivateKey.random();
let privilegedAddress = privilegedKey.toPublicKey();

let initialBalance = 10_000_000_000;
let zkapp = new Election(zkappAddress);

console.time('compile');
await Election.compile();
console.timeEnd('compile');

console.time('deploy');
let tx = await Mina.transaction(sender, () => {
  let senderUpdate = AccountUpdate.fundNewAccount(sender);
  senderUpdate.send({ to: zkappAddress, amount: initialBalance });
  zkapp.deploy({ zkappKey });
});
await tx.prove();
await tx.sign([senderKey]).send();
console.timeEnd('deploy');

console.log(
  'initial state: ',
  zkapp.ballot1.get().toBigInts(),
  zkapp.ballot2.get().toBigInts(),
  zkapp.ballot3.get().toBigInts(),
  zkapp.ballot4.get().toBigInts()
);

console.time('vote on ballot 1');
tx = await Mina.transaction(sender, () => {
  const myVote = Ballot.fromBigInts([0n, 0n, 1n, 0n, 0n, 0n, 0n]);
  zkapp.castBallot1(myVote);
});
await tx.prove();
await tx.sign([senderKey]).send();
console.timeEnd('vote on ballot 1');

console.time('vote on ballot 3');
tx = await Mina.transaction(sender, () => {
  const myVote = Ballot.fromBigInts([0n, 0n, 0n, 0n, 0n, 0n, 1n]);
  zkapp.castBallot3(myVote);
});
await tx.prove();
await tx.sign([senderKey]).send();
console.timeEnd('vote on ballot 3');

console.log(
  'final state: ',
  zkapp.ballot1.get().toBigInts(),
  zkapp.ballot2.get().toBigInts(),
  zkapp.ballot3.get().toBigInts(),
  zkapp.ballot4.get().toBigInts()
);

// compile: 28.710s
// deploy: 1.848s
// initial state:  [
//   0n, 0n, 0n, 0n,
//   0n, 0n, 0n
// ] [
//   0n, 0n, 0n, 0n,
//   0n, 0n, 0n
// ] [
//   0n, 0n, 0n, 0n,
//   0n, 0n, 0n
// ] [
//   0n, 0n, 0n, 0n,
//   0n, 0n, 0n
// ]
// vote on ballot 1: 24.752s
// vote on ballot 3: 23.132s
// final state:  [
//   0n, 0n, 1n, 0n,
//   0n, 0n, 0n
// ] [
//   0n, 0n, 0n, 0n,
//   0n, 0n, 0n
// ] [
//   0n, 0n, 0n, 0n,
//   0n, 0n, 1n
// ] [
//   0n, 0n, 0n, 0n,
//   0n, 0n, 0n
// ]
