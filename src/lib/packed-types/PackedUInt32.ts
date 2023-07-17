import { Field, Provable, UInt32 } from 'snarkyjs';
import { PackingPlant } from '../PackingPlant';

const SIZE_IN_BITS = 32n;

export function PackedUInt32Factory(l: number) {
  class PackedUInt32_ extends PackingPlant(UInt32, l, SIZE_IN_BITS) {
    /**
     * Unpacks a Field into its component UInt32 parts
     * @param value
     * @returns the unpacked auxilliary data used to pack the value
     */
    static toAuxiliary(value?: { packed: Field } | undefined): UInt32[] {
      const auxiliary = Provable.witness(Provable.Array(UInt32, l), () => {
        let uints_: bigint[] = [];
        let packedN = value?.packed.toBigInt() || 0n;
        for (let i = 0; i < l; i++) {
          uints_[i] = packedN & ((1n << SIZE_IN_BITS) - 1n);
          packedN >>= SIZE_IN_BITS;
        }
        return uints_.map((x) => UInt32.from(x));
      });
      return auxiliary;
    }

    static pack(aux: UInt32[]): Field {
      let f = Field(0);
      for (let i = 0; i < l; i++) {
        const c = Field((2n ** SIZE_IN_BITS) ** BigInt(i));
        f = f.add(aux[i].value.mul(c));
      }
      return f;
    }
  }
  return PackedUInt32_;
}
