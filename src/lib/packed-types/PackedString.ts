import { Field, Provable, Character } from 'snarkyjs';
import { MultiPackingPlant, PackingPlant } from '../PackingPlant.js';

const SIZE_IN_BITS = 16n;
const CHARS_PER_FIELD = 15;

export function PackedStringFactory(l: number) {
  class PackedCharacter_ extends MultiPackingPlant(Character, l, SIZE_IN_BITS) {
    /**
     * Unpacks a Fields into its component Character parts
     * @param value
     * @returns the unpacked auxilliary data used to pack the value
     */
    static toAuxiliary(
      value?: { packed: Array<Field> } | undefined
    ): Character[] {
      const auxiliary = Provable.witness(Provable.Array(Character, l), () => {
        let uints_ = new Array(l);
        uints_.fill(0n, 0, l);
        console.log(uints_);
        let packedNs = new Array(this.n);
        packedNs.fill(0n);
        for (let i = 0; i < this.n; i++) {
          if (value && value.packed[i].isConstant()) {
            packedNs[i] = value.packed[i].toBigInt();
          } else {
            packedNs[i] = 0n;
          }
        }
        for (let i = 0; i < packedNs.length; i++) {
          let packedN = packedNs[i];
          for (let j = 0; j < CHARS_PER_FIELD; j++) {
            const k = i * CHARS_PER_FIELD + j;
            uints_[k] = packedN & ((1n << SIZE_IN_BITS) - 1n);
            packedN >>= SIZE_IN_BITS;
          }
        }
        console.log(uints_);
        return uints_.map((x) =>
          Character.fromString(String.fromCharCode(Number(x)))
        );
      });
      return auxiliary;
    }

    static pack(aux: Character[]): Array<Field> {
      let fields = [];
      let mutableAux = [...aux];
      while (mutableAux.length > 0) {
        let f = Field(0);
        const n = Math.min(mutableAux.length, CHARS_PER_FIELD);
        for (let i = 0; i < n; i++) {
          const char = mutableAux.shift();
          const value = char?.value || Field(0);
          const c = Field((2n ** SIZE_IN_BITS) ** BigInt(i));
          f = f.add(value.mul(c));
        }
        fields.push(f);
      }
      return fields;
    }
  }
  return PackedCharacter_;
}
