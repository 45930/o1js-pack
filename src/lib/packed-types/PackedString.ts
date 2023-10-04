import { Field, Provable, Character, Poseidon } from 'o1js';
import { PackingPlant, MultiPackingPlant } from '../PackingPlant.js';

const SIZE_IN_BITS = 16n;
const L = 15; // Default to one-field worth of characters
const CHARS_PER_FIELD = 15;

export function PackedStringFactory(l: number = L) {
  class PackedString_ extends PackingPlant(Character, l, SIZE_IN_BITS) {
    static extractField(input: Character): Field {
      return input.value;
    }

    static sizeInBits(): bigint {
      return SIZE_IN_BITS;
    }

    /**
     *
     * @param f Field, packed with the information, as returned by #pack
     * @returns Array of Character
     */
    static unpack(f: Field): Character[] {
      const unpacked = Provable.witness(Provable.Array(Character, l), () => {
        const unpacked = this.unpackToBigints(f);
        return unpacked.map((x) =>
          Character.fromString(String.fromCharCode(Number(x)))
        );
      });
      f.assertEquals(PackedString_.pack(unpacked));
      return unpacked;
    }

    /**
     *
     * @param characters Array of Character to be packed
     * @returns Instance of the implementing class
     */
    static fromCharacters(input: Array<Character>): PackedString_ {
      let characters: Array<Character> = new Array(this.l);
      characters.fill(new Character(Field(0)), 0, this.l);
      for (let i = 0; i < input.length; i++) {
        characters[i] = input[i];
      }
      const packed = this.pack(characters);
      return new PackedString_(packed);
    }

    /**
     *
     * @param str string to be packed
     * @returns Instance of the implementing class
     */
    static fromString(str: string): PackedString_ {
      let characters: Array<Character> = new Array(this.l);
      characters.fill(new Character(Field(0)), 0, this.l);
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

export function MultiPackedStringFactory(l: number) {
  class MultiPackedString_ extends MultiPackingPlant(
    Character,
    l,
    SIZE_IN_BITS
  ) {
    static extractField(input: Character): Field {
      return input.value;
    }

    static sizeInBits(): bigint {
      return SIZE_IN_BITS;
    }

    static elementsPerField(): number {
      return CHARS_PER_FIELD;
    }

    /**
     *
     * @param fields Array of Fields, containing packed Characters
     * @returns Array of Character
     */
    static unpack(fields: Field[]): Character[] {
      const unpacked = Provable.witness(
        Provable.Array(Character, this.totalLength()),
        () => {
          let unpacked = this.unpackToBigints(fields);
          return unpacked.map((x) =>
            Character.fromString(String.fromCharCode(Number(x)))
          );
        }
      );
      Poseidon.hash(fields).assertEquals(
        Poseidon.hash(MultiPackedString_.pack(unpacked))
      );
      return unpacked;
    }

    /**
     *
     * @param characters Array of Character to be packed
     * @returns Instance of the implementing class
     */
    static fromCharacters(input: Array<Character>): MultiPackedString_ {
      let characters: Array<Character> = new Array(this.totalLength());
      characters.fill(new Character(Field(0)), 0, this.totalLength());
      for (let i = 0; i < input.length; i++) {
        characters[i] = input[i];
      }
      const packed = this.pack(characters);
      return new MultiPackedString_(packed);
    }

    /**
     *
     * @param str string to be packed
     * @returns Instance of the implementing class
     */
    static fromString(str: string): MultiPackedString_ {
      let characters: Array<Character> = new Array(this.totalLength());
      characters.fill(new Character(Field(0)), 0, this.totalLength());
      for (let i = 0; i < str.length; i++) {
        characters[i] = Character.fromString(str[i]);
      }
      return this.fromCharacters(characters);
    }

    toString() {
      const nullChar = String.fromCharCode(0);
      return MultiPackedString_.unpack(this.packed)
        .filter((c) => c.toString() !== nullChar)
        .join('');
    }
  }
  return MultiPackedString_;
}
