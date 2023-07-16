import { Field, Provable, Character } from 'snarkyjs';
import { PackingPlant } from './PackingPlant';

const SIZE_IN_BITS = 16n;

export function PackedCharacterFactory(l: number) {
  class PackedCharacter_ extends PackingPlant(Character, l, SIZE_IN_BITS) {
    /**
     * Unpacks a Field into its component Character parts
     * @param value
     * @returns the unpacked auxilliary data used to pack the value
     */
    static toAuxiliary(value?: { packed: Field } | undefined): Character[] {
      const auxiliary = Provable.witness(Provable.Array(Character, l), () => {
        let uints_: bigint[] = [];
        let packedN = value?.packed.toBigInt() || 0n;
        for (let i = 0; i < l; i++) {
          uints_[i] = packedN & ((1n << SIZE_IN_BITS) - 1n);
          packedN >>= SIZE_IN_BITS;
        }
        return uints_.map((x) =>
          Character.fromString(String.fromCharCode(Number(x)))
        );
      });
      return auxiliary;
    }

    static pack(aux: Character[]): Field {
      let f = Field(0);
      for (let i = 0; i < l; i++) {
        const c = Field((2n ** SIZE_IN_BITS) ** BigInt(i));
        f = f.add(aux[i].value.mul(c));
      }
      return f;
    }
  }
  return PackedCharacter_;
}
