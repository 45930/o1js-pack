import { Bool } from 'snarkyjs';
import { PackedBoolFactory } from './PackedBool';

describe('PackedBool', () => {
  it('packs and unpacks 2 Bool values', async () => {
    const PackedBool_2 = PackedBoolFactory(2);

    const packedUInt32_2 = new PackedBool_2([
      Bool.fromJSON(false),
      Bool.fromJSON(true),
    ]);
    const f = packedUInt32_2.toFields()[0];
    const unpacked = PackedBool_2.unpack(f);

    console.log(unpacked.toString());
    expect(unpacked[0].toBoolean()).toBe(false);
    expect(unpacked[1].toBoolean()).toBe(true);
  });
  it('packs and unpacks 50 Bool values', async () => {
    const PackedBool_50 = PackedBoolFactory(50);

    const myBooleans = [
      true,
      true,
      false,
      false,
      true,
      false,
      true,
      true,
      true,
      false,
      true,
      true,
      false,
      false,
      true,
      false,
      true,
      true,
      true,
      false,
      true,
      true,
      false,
      false,
      true,
      false,
      true,
      true,
      true,
      false,
      true,
      true,
      false,
      false,
      true,
      false,
      true,
      true,
      true,
      false,
      true,
      true,
      false,
      false,
      true,
      false,
      true,
      true,
      true,
      false,
    ];

    const myBools = myBooleans.map((b) => Bool.fromJSON(b));

    const packedUInt32_50 = new PackedBool_50(myBools);
    const f = packedUInt32_50.toFields()[0];
    const unpacked = PackedBool_50.unpack(f);

    console.log(unpacked.toString());
    expect(unpacked[0].toBoolean()).toBe(myBooleans[0]);
    expect(unpacked[1].toBoolean()).toBe(myBooleans[1]);
    expect(unpacked[15].toBoolean()).toBe(myBooleans[15]);
    expect(unpacked[20].toBoolean()).toBe(myBooleans[20]);
    expect(unpacked[35].toBoolean()).toBe(myBooleans[35]);
    expect(unpacked[49].toBoolean()).toBe(myBooleans[49]);
  });
});
