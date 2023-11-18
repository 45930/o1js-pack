import { AccountUpdate, Mina, PrivateKey, UInt32 } from 'o1js';
import { UserBlockStamps, UserBlockStampsToken } from './contract.js';

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
let zkapp = new UserBlockStampsToken(zkappAddress);

console.time('compile');
await UserBlockStampsToken.compile();
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

Local.setBlockchainLength(UInt32.from(5));

console.time('join system');
tx = await Mina.transaction(sender, () => {
  AccountUpdate.fundNewAccount(sender);
  zkapp.joinSystem();
});
await tx.prove();
await tx.sign([senderKey]).send();
console.timeEnd('join system');

let tokenBalance = Mina.getBalance(sender, zkapp.token.id);
console.log(tokenBalance.toString());
console.log(UserBlockStamps.unpack(tokenBalance.value).toString());

Local.setBlockchainLength(UInt32.from(10));

console.time('interact with system');
tx = await Mina.transaction(sender, () => {
  zkapp.interactWithSystem();
});
await tx.prove();
await tx.sign([senderKey]).send();
console.timeEnd('interact with system');

tokenBalance = Mina.getBalance(sender, zkapp.token.id);
console.log(tokenBalance.toString());
console.log(UserBlockStamps.unpack(tokenBalance.value).toString());

// compile: 1.818s
// deploy: 615.559ms
// join system: 23.085s
// 5
// 5,0
// interact with system: 15.263s
// 42949672965
// 5,10
