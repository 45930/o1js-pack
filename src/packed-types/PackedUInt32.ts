import { Field, Provable, Struct, UInt32, provable } from 'snarkyjs';

export function PackedUInt32Factory(l: number) {
  class PackedUInt32_ extends Struct({
    packed: Field,
  }) {
    static type = provable({ packed: Field }, {});
    static l: number = l;
    packed: Field;
    uints: UInt32[];

    constructor(packed: Field, uints: UInt32[]) {
      super({ packed });
      this.uints = uints;
    }

    /**
     * Unpacks a Field into its component UInt32 parts
     * @param value
     * @returns the unpacked auxilliary data used to pack the value
     */
    static toAuxiliary(value?: { packed: Field } | undefined): UInt32[] {
      const auxiliary = Provable.witness(Provable.Array(UInt32, l), () => {
        let uints_: bigint[] = [];
        let packedN = value?.packed.toBigInt() || 0n;
        for (let i = 0; i < l; i++) {
          uints_[i] = packedN & ((1n << 32n) - 1n);
          packedN >>= 32n;
        }
        return uints_.map((x) => UInt32.from(x));
      });
      return auxiliary;
    }

    static pack(uints: UInt32[]): Field {
      let f = Field(0);
      for (let i = 0; i < l; i++) {
        const c = Field((2n ** 32n) ** BigInt(i));
        f = f.add(uints[i].value.mul(c));
      }
      return f;
    }

    static unpack(f: Field): UInt32[] {
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

    /**
     * Type 'typeof PackedUInt32_' is not assignable to type 'ProvablePure<{ packed: Field; }>'.
     * Types of property 'fromFields' are incompatible.
     * Type '(fields: Field[], aux: UInt32[]) => PackedUInt32_' is not assignable to type '(fields: Field[]) => { packed: Field; }'.
     * Target signature provides too few arguments. Expected 2 or more, but got 1.ts(2417)
     */
    // static fromFields(fields: Field[], aux: UInt32[]): PackedUInt32_ {
    //   if (fields.length !== 1) {
    //     throw new Error("Must be initialized with one field only")
    //   }
    //   const packed = fields[0];
    //   packed.assertEquals(this.pack(aux));
    //   return new PackedUInt32_(
    //     packed,
    //     aux
    //   );
    // }
  }
  return PackedUInt32_;
}
