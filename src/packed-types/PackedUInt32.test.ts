import { Field, Struct, UInt32 } from 'snarkyjs';
import { PackedUInt32Factory } from './PackedUInt32';

describe('PackedUInt32', () => {
  it('packs and unpacks 2 UInt32 values', async () => {
    const PackedUInt32_2 = PackedUInt32Factory(2);

    const packedUInt32_2 = new PackedUInt32_2([
      UInt32.from(67),
      UInt32.from(2n ** 32n - 1n),
    ]);
    const f = packedUInt32_2.toFields()[0];
    const unpacked = PackedUInt32_2.unpack(f);

    expect(unpacked[0].toBigint()).toBe(67n);
    expect(unpacked[1].toBigint()).toBe(2n ** 32n - 1n);
    // Why isn't my type provable?
    //   expect(packedUInt32_2.sizeInFields()).toBe(1);
  });
  it('packs and unpacks 5 UInt32 values', async () => {
    const PackedUInt32_5 = PackedUInt32Factory(5);

    const packedUInt32_2 = new PackedUInt32_5([
      UInt32.from(67),
      UInt32.from(2n ** 32n - 1n),
      UInt32.from(0),
      UInt32.from(0),
      UInt32.from(128),
    ]);

    const f = packedUInt32_2.toFields()[0];
    const unpacked = PackedUInt32_5.unpack(f);

    expect(unpacked[0].toBigint()).toBe(67n);
    expect(unpacked[1].toBigint()).toBe(2n ** 32n - 1n);
    expect(unpacked[2].toBigint()).toBe(0n);
    expect(unpacked[3].toBigint()).toBe(0n);
    expect(unpacked[4].toBigint()).toBe(128n);
  });
});
