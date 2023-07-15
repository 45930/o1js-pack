import { Bool } from 'snarkyjs';
import { PackedBoolFactory } from './PackedBool';

describe('PackedBool', () => {
  it('packs and unpacks 2 Bool values', async () => {
    const myBooleans = [false, true];
    const myBools = myBooleans.map((b) => Bool(b));
    const PackedBool_2 = PackedBoolFactory(2);

    const packedBool_2 = new PackedBool_2(PackedBool_2.pack(myBools), myBools);
    const f = packedBool_2.packed;
    const unpacked = PackedBool_2.unpack(f);

    expect(unpacked[0].toBoolean()).toBe(false);
    expect(unpacked[1].toBoolean()).toBe(true);
    expect(unpacked[0].toBoolean()).toBe(packedBool_2.bools[0].toBoolean());
    expect(unpacked[1].toBoolean()).toBe(packedBool_2.bools[1].toBoolean());
  });
  it('packs and unpacks 50 Bool values', async () => {
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
    const myBools = myBooleans.map((b) => Bool(b));
    const PackedBool_50 = PackedBoolFactory(50);

    const packedBool_50 = new PackedBool_50(
      PackedBool_50.pack(myBools),
      myBools
    );
    const f = packedBool_50.packed;
    const unpacked = PackedBool_50.unpack(f);

    expect(unpacked[0].toBoolean()).toBe(myBooleans[0]);
    expect(unpacked[1].toBoolean()).toBe(myBooleans[1]);
    expect(unpacked[15].toBoolean()).toBe(myBooleans[15]);
    expect(unpacked[20].toBoolean()).toBe(myBooleans[20]);
    expect(unpacked[35].toBoolean()).toBe(myBooleans[35]);
    expect(unpacked[49].toBoolean()).toBe(myBooleans[49]);
  });
  it('mixes and matches class types', () => {
    const myBooleans = [true, true, false, false, true, false];
    const myBools = myBooleans.map((b) => Bool(b));
    const PackedBool_2 = PackedBoolFactory(2);
    const PackedBool_50 = PackedBoolFactory(50);

    const packedBool_2 = new PackedBool_2(PackedBool_2.pack(myBools), myBools);
    const packedBool_50 = new PackedBool_50(
      PackedBool_2.pack(myBools),
      myBools
    );

    // TODO: Is this desired behavior?
    console.log(
      PackedBool_2.toAuxiliary({ packed: packedBool_2.packed }).toString()
    );
    // > console.log
    // > true,true
    console.log(
      PackedBool_50.toAuxiliary({ packed: packedBool_50.packed }).toString()
    );
    // > console.log
    // > true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false
  });
});
