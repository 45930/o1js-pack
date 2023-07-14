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
    static toAuxiliary(value?: { packed: Field } | undefined): any[] {
      const auxiliary = Provable.witness(Provable.Array(UInt32, l), () => {
        let uints: bigint[] = [];
        let packedN = value?.packed.toBigInt() || 0n;
        for (let i = 0; i < l; i++) {
          uints[i] = packedN & ((1n << 32n) - 1n);
          packedN >>= 32n;
        }
        return uints.map((x) => UInt32.from(x));
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
      const unpacked = this.toAuxiliary(value);
      const packed = this.pack(unpacked);
      packed.assertEquals(value.packed);
    }
  }
  return PackedUInt32_;
}
