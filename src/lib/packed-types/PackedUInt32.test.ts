import { Provable, UInt32 } from 'snarkyjs';
import { PackedUInt32Factory } from './PackedUInt32';

describe('PackedUInt32', () => {
  class PackedUInt32 extends PackedUInt32Factory(7) {}
  describe('Outside of the circuit', () => {
    const bigints = [10n, 2n ** 32n - 1n, 0n, 10n, 2n ** 32n - 100n, 42n, 0n];
    const uints = bigints.map((x) => UInt32.from(x));

    it('#fromBigInts', () => {
      const myPackedUInt32 = PackedUInt32.fromBigInts(bigints);
      expect(myPackedUInt32.toBigInts()).toMatchObject(bigints);
    });

    it('#pack and #unPack', () => {
      const packed = PackedUInt32.pack(uints);
      const unpacked = PackedUInt32.unpack(packed);

      expect(unpacked.length).toBe(uints.length);
      expect(unpacked).toMatchObject(uints);
    });
  });
  describe('Provable Properties', () => {
    it('#sizeInFields', () => {
      class one extends PackedUInt32Factory(1) {}
      class seven extends PackedUInt32Factory(7) {}

      expect(one.sizeInFields()).toBe(1);
      expect(seven.sizeInFields()).toBe(1);
    });
  });
  describe('Defensive Cases', () => {
    it('throws for input >= 8 uints', () => {
      expect(() => PackedUInt32Factory(7)).not.toThrow();
      expect(() => PackedUInt32Factory(8)).toThrow();
    });

    it('initalizes with more input than allowed', () => {
      const bigints = [
        10n,
        2n ** 32n - 1n,
        0n,
        10n,
        2n ** 32n - 100n,
        42n,
        0n,
        0n,
      ];

      expect(() => {
        PackedUInt32.fromBigInts(bigints);
      }).toThrow();
    });
  });
  describe('In the circuit', () => {
    const bigints = [10n, 2n ** 32n - 1n, 0n, 10n, 2n ** 32n - 100n, 42n, 0n];
    const outsidePackedUInt = PackedUInt32.fromBigInts(bigints);

    it('Initializes', () => {
      expect(() => {
        Provable.runAndCheck(() => {
          const packedUInt32 = new PackedUInt32(
            outsidePackedUInt.packed,
            outsidePackedUInt.aux
          );

          PackedUInt32.check({ packed: packedUInt32.packed });
        });
      }).not.toThrow();
    });
    it('#assertEquals', () => {
      expect(() => {
        Provable.runAndCheck(() => {
          const packedUInt32 = new PackedUInt32(
            outsidePackedUInt.packed,
            outsidePackedUInt.aux
          );
          packedUInt32.assertEquals(outsidePackedUInt);
        });
      }).not.toThrow();
      expect(() => {
        Provable.runAndCheck(() => {
          const fakePacked = outsidePackedUInt.packed.add(32);
          const packedUInt32 = new PackedUInt32(
            fakePacked,
            outsidePackedUInt.aux
          );
          packedUInt32.assertEquals(outsidePackedUInt);
        });
      }).toThrow();
    });
  });
});
