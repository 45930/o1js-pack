import { Character, Field, Provable } from 'o1js';
import { PackedStringFactory, MultiPackedStringFactory } from './PackedString';

describe('PackedString', () => {
  describe('Outside of the Circuit', () => {
    const vitalik_dot_eth = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
    class EthAddressString extends MultiPackedStringFactory(3) {}
    let characters: Array<Character> = [];

    beforeEach(() => {
      characters = [];
      for (let i = 0; i < vitalik_dot_eth.length; i++) {
        characters.push(Character.fromString(vitalik_dot_eth[i]));
      }
    });

    it('#fromString', () => {
      const myEthAddress = EthAddressString.fromString(vitalik_dot_eth);
      expect(myEthAddress.toString()).toBe(vitalik_dot_eth);
    });

    it('#fromCharacters', () => {
      const myEthAddress = EthAddressString.fromCharacters(characters);
      expect(myEthAddress.toString()).toBe(vitalik_dot_eth);
    });

    it('#pack and #unPack', () => {
      const unpacked = EthAddressString.unpack(
        EthAddressString.fromCharacters(characters).packed
      );
      const packed = EthAddressString.pack(unpacked);

      expect(packed.length).toBe(Math.ceil(vitalik_dot_eth.length / 15));
      expect(unpacked.length).toBe(EthAddressString.l);
      expect(unpacked.length).toBe(45);
      expect(unpacked.slice(0, characters.length).toString()).toBe(
        characters.toString()
      );
    });
  });
  describe('Provable Properties', () => {
    it('#sizeInFields', () => {
      class one extends PackedStringFactory(15) {}
      class two extends MultiPackedStringFactory(2) {}
      class three extends MultiPackedStringFactory(3) {}

      expect(one.sizeInFields()).toBe(1);
      expect(two.sizeInFields()).toBe(2);
      expect(three.sizeInFields()).toBe(3);
    });
  });
  describe('Defensive Cases', () => {
    it('Initializes a class with fewer than allowed characters', () => {
      class String10 extends PackedStringFactory(10) {}

      const string0 = String10.fromString('');
      const string2 = String10.fromString('ab');

      expect(string0.toString()).toBe('');
      expect(string2.toString()).toBe('ab');
    });
    it('Initializes a class with more than allowed characters', () => {
      class String10 extends PackedStringFactory(10) {}

      expect(() => {
        String10.fromString('abcdefghijk');
      }).toThrow();
    });
    it('Exceeds maximum size string', () => {
      const tooLong = 'too long!'.repeat(20);
      class MaxString extends MultiPackedStringFactory(8) {}
      expect(() => {
        MaxString.fromString(tooLong);
      }).toThrow();
    });
  });
  describe('In the circuit', () => {
    const vitalik_dot_eth = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
    class EthAddressString extends MultiPackedStringFactory(3) {}

    const outsideEthAddress = EthAddressString.fromString(vitalik_dot_eth);

    it('Initializes a string', () => {
      expect(() => {
        Provable.runAndCheck(() => {
          const myEthAddress = new EthAddressString(outsideEthAddress.packed);

          EthAddressString.check({ packed: myEthAddress.packed });
        });
      }).not.toThrow();
    });

    it('#assertEquals', () => {
      expect(() => {
        Provable.runAndCheck(() => {
          const myEthAddress = new EthAddressString(outsideEthAddress.packed);

          myEthAddress.assertEquals(outsideEthAddress);
        });
      }).not.toThrow();

      expect(() => {
        Provable.runAndCheck(() => {
          const fakePacked = [...outsideEthAddress.packed];
          fakePacked[0] = fakePacked[0].add(1);
          const myEthAddress = new EthAddressString(fakePacked);

          myEthAddress.assertEquals(outsideEthAddress);
        });
      }).toThrow();
    });
  });
});
