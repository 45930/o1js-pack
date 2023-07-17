import { Character, Field, Provable } from 'snarkyjs';
import { PackedStringFactory } from './PackedString';

describe('PackedString', () => {
  it('unpacks an eth address as a string', async () => {
    const vitalik_dot_eth = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

    let myCharacters = [];
    for (let i = 0; i < vitalik_dot_eth.length; i++) {
      myCharacters.push(Character.fromString(vitalik_dot_eth[i]));
    }

    const EthAddressString = PackedStringFactory(42);
    const myEthAddress = new EthAddressString(
      EthAddressString.pack(myCharacters),
      myCharacters
    );

    expect(
      EthAddressString.unpack(myEthAddress.packed)
        .map((c) => c.toString())
        .join('')
    ).toBe(vitalik_dot_eth);
  });
  it('handles blank input', async () => {
    const EthAddressString = PackedStringFactory(42);
    const myEthAddress = new EthAddressString([Field(0)], []);

    expect(() => {
      EthAddressString.unpack(myEthAddress.packed)
        .map((c) => c.toString())
        .join('');
    }).not.toThrow();
  });
  describe('in the circuit', () => {
    it('works', () => {
      expect(() => {
        Provable.runAndCheck(() => {
          const vitalik_dot_eth = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

          let myCharacters = [];
          for (let i = 0; i < vitalik_dot_eth.length; i++) {
            myCharacters.push(Character.fromString(vitalik_dot_eth[i]));
          }

          const EthAddressString = PackedStringFactory(42);
          const packed = EthAddressString.pack(myCharacters);
          const myEthAddress = new EthAddressString(packed, myCharacters);

          for (let i = 0; i < EthAddressString.n; i++) {
            myEthAddress.packed[i].assertEquals(packed[i]);
          }
        });
      }).not.toThrow();
    });
  });
});
