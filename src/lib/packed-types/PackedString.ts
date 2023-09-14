import { Field, Provable, Character } from 'o1js';
import { MultiPackingPlant } from '../PackingPlant.js';

const SIZE_IN_BITS = 16n;
const L = 15; // Default to one-field worth of characters
const CHARS_PER_FIELD = 15;

export function PackedStringFactory(l: number = L) {
  class PackedString_ extends MultiPackingPlant(Character, l, SIZE_IN_BITS) {
    static extractField(input: Character): Field {
      return input.value;
    }

    static sizeInBits(): bigint {
      return SIZE_IN_BITS;
    }

    static elementsPerField(): number {
      return CHARS_PER_FIELD;
    }

    static unpack(fields: Field[]): Character[] {
      const unpacked = Provable.witness(Provable.Array(Character, l), () => {
        let unpacked = this.unpackToBigints(fields);
        return unpacked.map((x) =>
          Character.fromString(String.fromCharCode(Number(x)))
        );
      });
      return unpacked;
    }

    static fromCharacters(characters: Array<Character>): PackedString_ {
      const packed = this.pack(characters);
      return new PackedString_(packed);
    }

    static fromString(str: string): PackedString_ {
      let characters: Array<Character> = new Array(l);
      characters.fill(new Character(Field(0)), 0, l);
      for (let i = 0; i < str.length; i++) {
        characters[i] = Character.fromString(str[i]);
      }
      return this.fromCharacters(characters);
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
