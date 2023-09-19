import {
  Field,
  Struct,
  Poseidon,
  provable,
  InferProvable,
  Provable,
} from 'o1js';

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
    bitSize: bigint = bitSize;

    constructor(packed: Field) {
      super({ packed });
    }

    // Must implement these in type-specific implementation
    static extractField(input: T): Field {
      throw new Error('Must implement extractField');
    }
    static sizeInBits(): bigint {
      throw new Error('Must implement sizeInBits');
    }
    static unpack(f: Field): Array<T> {
      throw new Error('Must implement unpack');
    }
    // End

    /**
     *
     * @param unpacked Array of the implemented packed type
     * @throws if the length of the array is longer than the length of the implementing factory config
     */
    static checkPack(unpacked: Array<T>) {
      if (unpacked.length > l) {
        throw new Error(
          `Input of size ${unpacked.length} is larger than expected size of ${l}`
        );
      }
    }

    /**
     *
     * @param unpacked Array of the implemented packed type, must be shorter than the max allowed, which varies by type, will throw if the input is too long
     * @returns Field, packed with the information from the unpacked input
     */
    static pack(unpacked: Array<T>): Field {
      this.checkPack(unpacked);
      let f = this.extractField(unpacked[0]);
      const n = Math.min(unpacked.length, l);
      for (let i = 1; i < n; i++) {
        const c = Field((2n ** this.sizeInBits()) ** BigInt(i));
        f = f.add(this.extractField(unpacked[i]).mul(c));
      }
      return f;
    }

    /**
     *
     * @param f Field, packed with the information, as returned by #pack
     * @returns Array of bigints, which can be decoded by the implementing class into the final type
     */
    static unpackToBigints(f: Field): Array<bigint> {
      let unpacked = new Array(l);
      unpacked.fill(0n);
      let packedN;
      if (f) {
        packedN = f.toBigInt();
      } else {
        throw new Error('No Packed Value Provided');
      }
      for (let i = 0; i < l; i++) {
        unpacked[i] = packedN & ((1n << this.sizeInBits()) - 1n);
        packedN >>= this.sizeInBits();
      }
      return unpacked;
    }

    assertEquals(other: Packed_) {
      this.packed.assertEquals(other.packed);
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
    bitSize: bigint = bitSize;

    constructor(packed: Array<Field>) {
      super({ packed });
    }

    // Must implement these in type-specific implementation
    static extractField(input: T | undefined): Field {
      throw new Error('Must implement extractField');
    }
    static sizeInBits(): bigint {
      throw new Error('Must implement sizeInBits');
    }
    static elementsPerField(): number {
      throw new Error('Must implement elementsPerField');
    }
    static unpack(fields: Array<Field>): Array<T> {
      throw new Error('Must implement unpack');
    }
    // End

    /**
     *
     * @param unpacked Array of the implemented packed type
     * @throws if the length of the array is longer than the length of the implementing factory config
     */
    static checkPack(unpacked: Array<T>) {
      if (unpacked.length > l) {
        throw new Error(
          `Input of size ${unpacked.length} is larger than expected size of ${l}`
        );
      }
    }

    /**
     *
     * @param unpacked Array of the implemented packed type, must be shorter than the max allowed, which varies by type, will throw if the input is too long
     * @returns Array of Fields, packed such that each Field has as much information as possible
     *
     * e.g. 15 Characters pack into 1 Field.  15 or fewer Characters will return an array of 1 Field
     *      30 of fewer Characters will return an aray of 2 Fields
     */
    static pack(unpacked: Array<T>): Array<Field> {
      this.checkPack(unpacked);
      let fields = [];
      let mutableUnpacked = [...unpacked];
      while (mutableUnpacked.length > 0) {
        let f = this.extractField(mutableUnpacked.shift());
        if (!f) {
          throw new Error('Unexpected Array Length');
        }
        // f = f.value is the same as f = 0; f += char.value * c^0;
        // If f is initialized as 0, then it is a "constant" field and can't be added to a "variable" field in a proof
        const n = Math.min(mutableUnpacked.length + 1, this.elementsPerField());
        for (let i = 1; i < n; i++) {
          let value = this.extractField(mutableUnpacked.shift());
          if (!value) {
            throw new Error('Unexpected Array Length');
          }
          value = value || Field(0);
          const c = Field((2n ** this.sizeInBits()) ** BigInt(i));
          f = f.add(value.mul(c));
        }
        fields.push(f);
      }
      return fields;
    }

    /**
     *
     * @param fields Array of Fields, packed such that each Field has as much information as possible, as returned in #pack
     * @returns Array of bigints, which can be decoded by the implementing class into the final type
     */
    static unpackToBigints(fields: Array<Field>): Array<bigint> {
      let uints_ = new Array(l);
      uints_.fill(0n);
      let packedNs = new Array(this.n);
      packedNs.fill(0n);
      const packedArg = new Array(this.n);
      packedArg.fill(Field(0), 0, this.n);
      for (let i = 0; i < this.n; i++) {
        if (fields[i]) {
          packedArg[i] = fields[i];
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
        for (let j = 0; j < this.elementsPerField(); j++) {
          const k = i * this.elementsPerField() + j;
          uints_[k] = packedN & ((1n << this.sizeInBits()) - 1n);
          packedN >>= this.sizeInBits();
        }
      }
      return uints_;
    }

    assertEquals(other: Packed_) {
      for (let x = 0; x < n; x++) {
        this.packed[x].assertEquals(other.packed[x]);
      }
    }
  }
  return Packed_;
}
