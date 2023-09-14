import { Field, Provable, UInt32 } from 'o1js';
import { PackingPlant } from '../PackingPlant.js';

const L = 7; // 7 32-byte uints fit in one Field
const SIZE_IN_BITS = 32n;

export function PackedUInt32Factory(l: number = L) {
  class PackedUInt32_ extends PackingPlant(UInt32, l, SIZE_IN_BITS) {
    static extractField(input: UInt32): Field {
      return input.value;
    }

    static sizeInBits(): bigint {
      return SIZE_IN_BITS;
    }

    static unpack(f: Field): UInt32[] {
      const unpacked = Provable.witness(Provable.Array(UInt32, l), () => {
        const unpacked = this.unpackToBigints(f);
        return unpacked.map((x) => UInt32.from(x));
      });
      return unpacked;
    }

    static fromUInt32s(uint32s: Array<UInt32>): PackedUInt32_ {
      const packed = PackedUInt32_.pack(uint32s);
      return new PackedUInt32_(packed);
    }

    static fromBigInts(bigints: Array<bigint>): PackedUInt32_ {
      const uint32s = bigints.map((x) => UInt32.from(x));
      return PackedUInt32_.fromUInt32s(uint32s);
    }

    toBigInts(): Array<bigint> {
      return PackedUInt32_.unpack(this.packed).map((x) => x.toBigint());
    }
  }
  return PackedUInt32_;
}
