import { Field, Struct, provable, InferProvable, Provable } from 'snarkyjs';

const MAX_BITS_PER_FIELD = 254n;

export function PackingPlant<A, T extends InferProvable<A> = InferProvable<A>>(
  elementType: A,
  l: number,
  bitSize: bigint
) {
  if (bitSize * BigInt(l) > MAX_BITS_PER_FIELD) {
    throw new Error(
      `The Packing Plant is only accepting orders that can fit into one Field, try using MultiPackingPlant`
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

export function MultiPackingPlant<
  A,
  T extends InferProvable<A> = InferProvable<A>
>(elementType: A, l: number, bitSize: bigint) {
  if (bitSize * BigInt(l) > 8n * MAX_BITS_PER_FIELD) {
    throw new Error(
      `The Packing Plant is only accepting orders that can fit into eight Fields`
    );
  }
  const n = Math.ceil(Number(bitSize * BigInt(l)) / Number(255n));
  abstract class Packed_ extends Struct({
    packed: Provable.Array(Field, n),
  }) {
    static type = provable({ packed: Provable.Array(Field, n) }, {});
    static l: number = l;
    static n: number = n;
    packed: Array<Field>;
    aux: Array<T>;
    bitSize: bigint = bitSize;

    constructor(packed: Array<Field>, aux: Array<T>) {
      super({ packed });
      this.aux = aux;
    }

    /**
     * Unpacks a Field into its component parts
     *
     * @param value
     * @returns the unpacked auxilliary data used to pack the value
     */
    static toAuxiliary(value?: { packed: Array<Field> } | undefined): Array<T> {
      throw new Error('Must implement toAuxiliary');
      return [];
    }

    static pack(aux: Array<T>): Array<Field> {
      throw new Error('Must implement pack');
      let f = [Field(0)];
      return f;
    }

    static unpack(fields: Array<Field>) {
      return this.toAuxiliary({ packed: fields });
    }

    /**
     * In-Circuit verifiaction of the packed Field
     */
    static check(value: { packed: Array<Field> }) {
      const unpacked = this.toAuxiliary({ packed: value.packed });
      const packed = this.pack(unpacked);
      for (let i = 0; i < n; i++) {
        packed[i].assertEquals(value.packed[i]);
      }
    }
  }
  return Packed_;
}
