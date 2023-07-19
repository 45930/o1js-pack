import { Field, Provable, UInt32 } from 'snarkyjs';
import { PackingPlant } from '../PackingPlant.js';

const SIZE_IN_BITS = 32n;

export function PackedUInt32Factory(l: number) {
  class PackedUInt32_ extends PackingPlant(UInt32, l, SIZE_IN_BITS) {
    static toAuxiliary(value?: { packed: Field } | undefined): Array<UInt32> {
      const auxiliary = Provable.witness(Provable.Array(UInt32, l), () => {
        let uints_ = new Array(l);
        uints_.fill(0n);
        let packedN;
        if (value && value.packed) {
          packedN = value.packed.toBigInt();
        } else {
          throw new Error('No Packed Value Provided');
        }
        for (let i = 0; i < l; i++) {
          uints_[i] = packedN & ((1n << SIZE_IN_BITS) - 1n);
          packedN >>= SIZE_IN_BITS;
        }
        return uints_.map((x) => UInt32.from(x));
      });
      return auxiliary;
    }

    static pack(aux: Array<UInt32>): Field {
      let f = aux[0].value;
      const n = Math.min(aux.length, l);
      for (let i = 1; i < n; i++) {
        const c = Field((2n ** SIZE_IN_BITS) ** BigInt(i));
        f = f.add(aux[i].value.mul(c));
      }
      return f;
    }

    static fromAuxiliary(aux: Array<UInt32>): PackedUInt32_ {
      const packed = PackedUInt32_.pack(aux);
      return new PackedUInt32_(packed, aux);
    }

    static fromBigInts(bigints: Array<bigint>): PackedUInt32_ {
      const uint32s = bigints.map((x) => UInt32.from(x));
      return this.fromAuxiliary(uint32s);
    }

    toBigInts(): Array<bigint> {
      return PackedUInt32_.unpack(this.packed).map((x) => x.toBigint());
    }
  }
  return PackedUInt32_;
}
