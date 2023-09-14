import { Field, Provable, Bool } from 'o1js';
import { PackingPlant } from '../PackingPlant.js';

const SIZE_IN_BITS = 1n;

export function PackedBoolFactory(l: number) {
  class PackedBool_ extends PackingPlant(Bool, l, SIZE_IN_BITS) {
    static toAuxiliary(value?: { packed: Field } | undefined): Array<Bool> {
      const auxiliary = Provable.witness(Provable.Array(Bool, l), () => {
        let bools_ = new Array(l);
        bools_.fill(0n);
        let packedN;
        if (value && value.packed) {
          packedN = value.packed.toBigInt();
        } else {
          throw new Error('No Packed Value Provided');
        }
        for (let i = 0; i < l; i++) {
          bools_[i] = packedN & ((1n << SIZE_IN_BITS) - 1n);
          packedN >>= SIZE_IN_BITS;
        }
        return bools_.map((x) => Bool.fromJSON(Boolean(x)));
      });
      return auxiliary;
    }

    static pack(aux: Array<Bool>): Field {
      let f = aux[0].toField();
      const n = Math.min(aux.length, l);
      for (let i = 1; i < n; i++) {
        const c = Field((2n ** SIZE_IN_BITS) ** BigInt(i));
        f = f.add(aux[i].toField().mul(c));
      }
      return f;
    }

    static fromAuxiliary(aux: Array<Bool>): PackedBool_ {
      const packed = PackedBool_.pack(aux);
      return new PackedBool_(packed, aux);
    }

    static fromBooleans(bigints: Array<boolean>): PackedBool_ {
      const uint32s = bigints.map((x) => Bool(x));
      return this.fromAuxiliary(uint32s);
    }

    toBooleans(): Array<boolean> {
      return PackedBool_.unpack(this.packed).map((x) => x.toBoolean());
    }
  }
  return PackedBool_;
}
