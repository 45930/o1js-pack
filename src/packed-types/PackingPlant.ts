import { Field, Struct, provable, InferProvable } from 'snarkyjs';

export function PackingPlant<A, T extends InferProvable<A> = InferProvable<A>>(
  elementType: A,
  l: number,
  bitSize: bigint
) {
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
    aux: Array<T>;
    bitSize: bigint = bitSize;

    constructor(packed: Field, aux: Array<T>) {
      super({ packed });
      this.aux = aux;
    }

    /**
     * Unpacks a Field into its component parts
     *
     * @param value
     * @returns the unpacked auxilliary data used to pack the value
     */
    static toAuxiliary(value?: { packed: Field } | undefined): Array<T> {
      throw new Error('Must implement toAuxiliary');
      return [];
    }

    static pack(aux: Array<T>): Field {
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
