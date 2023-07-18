import { Field, Provable, Character } from 'snarkyjs';
import { MultiPackingPlant } from '../PackingPlant.js';

const SIZE_IN_BITS = 16n;
const CHARS_PER_FIELD = 15;

export function PackedStringFactory(l: number) {
  class PackedString_ extends MultiPackingPlant(Character, l, SIZE_IN_BITS) {
    static toAuxiliary(
      value?: { packed: Array<Field> } | undefined
    ): Character[] {
      const auxiliary = Provable.witness(Provable.Array(Character, l), () => {
        let uints_ = new Array(l);
        uints_.fill(0n);
        let packedNs = new Array(this.n);
        packedNs.fill(0n);
        const packedArg = new Array(this.n);
        packedArg.fill(Field(0), 0, this.n);
        for (let i = 0; i < this.n; i++) {
          if (value?.packed[i]) {
            packedArg[i] = value?.packed[i];
          }
        }
        if (packedArg.length !== this.n) {
          throw new Error(`Packed value must be exactly ${this.n} in length`);
        }
        for (let i = 0; i < this.n; i++) {
          packedNs[i] = packedArg[i].toConstant().toBigInt();
        }
        for (let i = 0; i < packedNs.length; i++) {
          let packedN = packedNs[i];
          for (let j = 0; j < CHARS_PER_FIELD; j++) {
            const k = i * CHARS_PER_FIELD + j;
            uints_[k] = packedN & ((1n << SIZE_IN_BITS) - 1n);
            packedN >>= SIZE_IN_BITS;
          }
        }
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
        const initialChar = mutableAux.shift();
        if (!initialChar) {
          throw new Error('Unexpected Array Length');
        }
        // f = initialChar.value is the same as f = 0; f += char.value * c^0;
        // If f is initialized as 0, then it is a "constant" field and can't be added to a "variable" field in a proof
        let f = initialChar.value;
        const n = Math.min(mutableAux.length + 1, CHARS_PER_FIELD);
        for (let i = 1; i < n; i++) {
          const char = mutableAux.shift();
          if (!char) {
            throw new Error('Unexpected Array Length');
          }
          const value = char.value || Field(0);
          const c = Field((2n ** SIZE_IN_BITS) ** BigInt(i));
          f = f.add(value.mul(c));
        }
        fields.push(f);
      }
      return fields;
    }

    static fromString(str: string): PackedString_ {
      let characters = [];
      for (let i = 0; i < this.l; i++) {
        characters.push(Character.fromString(str[i]));
      }

      return this.fromAuxiliary(characters);
    }

    static fromAuxiliary(aux: Array<Character>): PackedString_ {
      const packed = this.pack(aux);
      return new PackedString_(packed, aux);
    }

    toString() {
      const nullChar = String.fromCharCode(0);
      return PackedString_.unpack(this.packed)
        .filter((c) => c.toString() !== nullChar)
        .join('');
    }
  }
  return PackedString_;
}
