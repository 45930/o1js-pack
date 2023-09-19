import { Bool, Provable } from 'o1js';
import { PackedBoolFactory } from './PackedBool';

describe('PackedBool', () => {
  const booleans = new Array(127).fill([true, false]).flat();
  const bools = booleans.map((x) => Bool(x));
  class PackedBool extends PackedBoolFactory() {}
  describe('Outside of the circuit', () => {
    it('#fromBooleans', () => {
      const myPackedBool = PackedBool.fromBooleans(booleans);
      expect(myPackedBool.toBooleans()).toMatchObject(booleans);
    });

    it('#pack and #unPack', () => {
      const packed = PackedBool.pack(bools);
      const unpacked = PackedBool.unpack(packed);

      expect(unpacked.length).toBe(bools.length);
      expect(unpacked).toMatchObject(bools);
    });
  });
  describe('Provable Properties', () => {
    it('#sizeInFields', () => {
      class one extends PackedBoolFactory(1) {}
      class two_five_four extends PackedBoolFactory(254) {}

      expect(one.sizeInFields()).toBe(1);
      expect(two_five_four.sizeInFields()).toBe(1);
    });
  });
  describe('Defensive Cases', () => {
    it('throws for input >= 255 bools', () => {
      expect(() => PackedBoolFactory(254)).not.toThrow();
      expect(() => PackedBoolFactory(255)).toThrow();
    });
    it('initalizes with more input than allowed', () => {
      const tooMany = [...booleans].concat(false);

      expect(() => {
        PackedBool.fromBooleans(tooMany);
      }).toThrow();
    });

    it('initalizes with less input than specified', () => {
      const booleans = [true, false];
      const pad = new Array(252);
      pad.fill(false);
      const expected = booleans.concat(pad);

      expect(PackedBool.fromBooleans(booleans).toBooleans()).toMatchObject(
        expected
      );
    });
  });
  describe('In the circuit', () => {
    const outsidePackedBool = PackedBool.fromBooleans(booleans);

    it('Initializes', () => {
      expect(() => {
        Provable.runAndCheck(() => {
          const packedBool = new PackedBool(outsidePackedBool.packed);

          PackedBool.check({ packed: packedBool.packed });
        });
      }).not.toThrow();
    });
    it('#assertEquals', () => {
      expect(() => {
        Provable.runAndCheck(() => {
          const packedBool = new PackedBool(outsidePackedBool.packed);
          packedBool.assertEquals(outsidePackedBool);
        });
      }).not.toThrow();
      expect(() => {
        Provable.runAndCheck(() => {
          const fakePacked = outsidePackedBool.packed.add(32);
          const packedBool = new PackedBool(fakePacked);
          packedBool.assertEquals(outsidePackedBool);
        });
      }).toThrow();
    });
  });
});
