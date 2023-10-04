import { Field, Provable, Bool } from 'o1js';
import { PackingPlant } from '../PackingPlant.js';

const L = 254; // 254 1-bit booleans fit in one Field
const SIZE_IN_BITS = 1n;

export function PackedBoolFactory(l: number = L) {
  class PackedBool_ extends PackingPlant(Bool, l, SIZE_IN_BITS) {
    static extractField(input: Bool): Field {
      return input.toField();
    }

    static sizeInBits(): bigint {
      return SIZE_IN_BITS;
    }

    /**
     *
     * @param f Field, packed with the information, as returned by #pack
     * @returns Array of Bool
     */
    static unpack(f: Field): Bool[] {
      const unpacked = Provable.witness(Provable.Array(Bool, l), () => {
        const unpacked = this.unpackToBigints(f);
        return unpacked.map((x) => Bool.fromJSON(Boolean(x)));
      });
      f.assertEquals(PackedBool_.pack(unpacked));
      return unpacked;
    }

    /**
     *
     * @param bools Array of Bools to be packed
     * @returns Instance of the implementing class
     */
    static fromBools(bools: Array<Bool>): PackedBool_ {
      const packed = PackedBool_.pack(bools);
      return new PackedBool_(packed);
    }

    /**
     *
     * @param booleans Array of booleans to be packed
     * @returns Instance of the implementing class
     */
    static fromBooleans(booleans: Array<boolean>): PackedBool_ {
      const bools = booleans.map((x) => Bool(x));
      return PackedBool_.fromBools(bools);
    }

    toBooleans(): Array<boolean> {
      return PackedBool_.unpack(this.packed).map((x) => x.toBoolean());
    }
  }
  return PackedBool_;
}
