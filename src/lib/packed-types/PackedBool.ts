import { Field, Provable, Bool } from 'snarkyjs';
import { PackingPlant } from '../PackingPlant';

const SIZE_IN_BITS = 1n;

export function PackedBoolFactory(l: number) {
  class PackedBool_ extends PackingPlant(Bool, l, SIZE_IN_BITS) {
    /**
     * Unpacks a Field into its component Bool parts
     * @param value
     * @returns the unpacked auxilliary data used to pack the value
     */
    static toAuxiliary(value?: { packed: Field } | undefined): Bool[] {
      const auxiliary = Provable.witness(Provable.Array(Bool, l), () => {
        let bools_: bigint[] = [];
        let packedN = value?.packed.toBigInt() || 0n;
        for (let i = 0; i < l; i++) {
          bools_[i] = packedN & ((1n << SIZE_IN_BITS) - 1n);
          packedN >>= SIZE_IN_BITS;
        }
        return bools_.map((x) => Bool.fromJSON(Boolean(x)));
      });
      return auxiliary;
    }

    static pack(aux: Bool[]): Field {
      let f = Field(0);
      for (let i = 0; i < l; i++) {
        const c = Field((2n ** SIZE_IN_BITS) ** BigInt(i));
        f = f.add(aux[i].toField().mul(c));
      }
      return f;
    }
  }
  return PackedBool_;
}
