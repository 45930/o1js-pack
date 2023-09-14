import { Field, Provable, Bool } from 'o1js';
import { PackingPlant } from '../PackingPlant.js';

const L = 254; // 254 1-byte uints fit in one Field
const SIZE_IN_BITS = 1n;

export class PackedBool extends PackingPlant(Bool, L, SIZE_IN_BITS) {
  static pack(aux: Array<Bool>): Field {
    let f = aux[0].toField();
    const n = Math.min(aux.length, L);
    for (let i = 1; i < n; i++) {
      const c = Field((2n ** SIZE_IN_BITS) ** BigInt(i));
      f = f.add(aux[i].toField().mul(c));
    }
    return f;
  }

  static unpack(f: Field): Bool[] {
    const unpacked = Provable.witness(Provable.Array(Bool, L), () => {
      let bools_ = new Array(L);
      bools_.fill(0n);
      let packedN;
      if (f) {
        packedN = f.toBigInt();
      } else {
        throw new Error('No Packed Value Provided');
      }
      for (let i = 0; i < L; i++) {
        bools_[i] = packedN & ((1n << SIZE_IN_BITS) - 1n);
        packedN >>= SIZE_IN_BITS;
      }
      return bools_.map((x) => Bool.fromJSON(Boolean(x)));
    });
    return unpacked;
  }

  static fromBools(bools: Array<Bool>): PackedBool {
    const packed = PackedBool.pack(bools);
    return new PackedBool(packed);
  }

  static fromBooleans(booleans: Array<boolean>): PackedBool {
    const bools = booleans.map((x) => Bool(x));
    return PackedBool.fromBools(bools);
  }

  toBooleans(): Array<boolean> {
    return PackedBool.unpack(this.packed).map((x) => x.toBoolean());
  }
}
