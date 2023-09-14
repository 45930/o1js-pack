import { Field, Provable, UInt32 } from 'o1js';
import { PackingPlant } from '../PackingPlant.js';

const L = 7; // 7 32-byte uints fit in one Field
const SIZE_IN_BITS = 32n;

export class PackedUInt32 extends PackingPlant(UInt32, L, SIZE_IN_BITS) {
  static pack(unpacked: Array<UInt32>): Field {
    let f = unpacked[0].value;
    const n = Math.min(unpacked.length, L);
    for (let i = 1; i < n; i++) {
      const c = Field((2n ** SIZE_IN_BITS) ** BigInt(i));
      f = f.add(unpacked[i].value.mul(c));
    }
    return f;
  }

  static unpack(f: Field): UInt32[] {
    const auxiliary = Provable.witness(Provable.Array(UInt32, L), () => {
      let uints_ = new Array(L);
      uints_.fill(0n);
      let packedN;
      if (f) {
        packedN = f.toBigInt();
      } else {
        throw new Error('No Packed Value Provided');
      }
      for (let i = 0; i < L; i++) {
        uints_[i] = packedN & ((1n << SIZE_IN_BITS) - 1n);
        packedN >>= SIZE_IN_BITS;
      }
      return uints_.map((x) => UInt32.from(x));
    });
    return auxiliary;
  }

  static fromUInt32s(uint32s: Array<UInt32>): PackedUInt32 {
    const packed = PackedUInt32.pack(uint32s);
    return new PackedUInt32(packed);
  }

  static fromBigInts(bigints: Array<bigint>): PackedUInt32 {
    const uint32s = bigints.map((x) => UInt32.from(x));
    return PackedUInt32.fromUInt32s(uint32s);
  }

  toBigInts(): Array<bigint> {
    return PackedUInt32.unpack(this.packed).map((x) => x.toBigint());
  }
}
