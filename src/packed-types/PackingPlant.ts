import { Bool, Character, Field, Struct, UInt32, provable } from 'snarkyjs';

type SupportedType = Bool | UInt32 | Character;

const bitSizes = {
  Bool: 1n,
  UInt32: 32n,
  Character: 16n,
};

export function PackingPlant<T>(elementType: T, l: number) {
  let bitSize = 0n;
  if (elementType instanceof Bool) {
    bitSize = bitSizes['Bool'];
  }
  if (elementType instanceof UInt32) {
    bitSize = bitSizes['UInt32'];
  }
  if (elementType instanceof Character) {
    bitSize = bitSizes['Character'];
  }
  if (bitSize === 0n) {
    throw new Error(
      `The Packing Plant is only accepting orders of type ${Object.keys(
        bitSizes
      )}`
    );
  }
  if (bitSize * BigInt(l) >= 255n) {
    throw new Error(
      `The Packing Plant is only accepting orders that can fit into a single Field`
    );
  }
  abstract class Packed_ extends Struct({
    packed: Field,
  }) {
    static type = provable({ packed: Field }, {});
    static l: number = l;
    packed: Field;
    aux: Array<SupportedType>;
    bitSize: bigint = bitSize;

    constructor(packed: Field, aux: Array<SupportedType>) {
      super({ packed });
      this.aux = aux;
    }

    /**
     * Unpacks a Field into its component parts
     *
     * @param value
     * @returns the unpacked auxilliary data used to pack the value
     */
    static toAuxiliary(value?: { packed: Field } | undefined): SupportedType[] {
      throw new Error('Must implement toAuxiliary');
      return [];
    }

    static pack(aux: SupportedType[]): Field {
      throw new Error('Must implement pack');
      let f = Field(0);
      return f;
    }

    static unpack(f: Field) {
      return this.toAuxiliary({ packed: f });
    }

    /**
     * In-Circuit verifiaction of the packed Field
     */
    static check(value: { packed: Field }) {
      const unpacked = this.toAuxiliary({ packed: value.packed });
      const packed = this.pack(unpacked);
      packed.assertEquals(value.packed);
    }
  }
  return Packed_;
}
