import { Character } from 'snarkyjs';
import { PackedStringFactory } from './packed-types/PackedString';

const main = () => {
  const vitalik_dot_eth = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

  // length = 42 ~ 3 ZkStringFragments
  console.log(vitalik_dot_eth, vitalik_dot_eth.length);

  let myCharacters = [];
  for (let i = 0; i < vitalik_dot_eth.length; i++) {
    myCharacters.push(Character.fromString(vitalik_dot_eth[i]));
  }

  const EthAddressString = PackedStringFactory(42);
  const myEthAddress = new EthAddressString(
    EthAddressString.pack(myCharacters),
    myCharacters
  );

  console.log(EthAddressString.unpack(myEthAddress.packed).toString());
};

main();
