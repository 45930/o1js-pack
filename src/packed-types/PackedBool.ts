import { Field, Provable, Struct, Bool, provable } from 'snarkyjs';

export function PackedBoolFactory(l: number) {
  class PackedBool_ extends Struct({
    packed: Field,
  }) {
    static type = provable({ packed: Field }, {});
    static l: number = l;
    packed: Field;
    aux: Bool[];

    constructor(packed: Field, aux: Bool[]) {
      super({ packed });
      this.aux = aux;
    }

    /**
     * Unpacks a Field into its component Bool parts
     * @param value
     * @returns the unpacked auxilliary data used to pack the value
     */
    static toAuxiliary(value?: { packed: Field } | undefined): Bool[] {
      const auxiliary = Provable.witness(Provable.Array(Bool, l), () => {
        let bools_: bigint[] = [];
        let packedN = value?.packed.toBigInt() || 0n;
        for (let i = 0; i < l; i++) {
          bools_[i] = packedN & ((1n << 1n) - 1n);
          packedN >>= 1n;
        }
        return bools_.map((x) => Bool.fromJSON(Boolean(x)));
      });
      return auxiliary;
    }

    static pack(aux: Bool[]): Field {
      let f = Field(0);
      for (let i = 0; i < l; i++) {
        const c = Field((2n ** 1n) ** BigInt(i));
        f = f.add(aux[i].toField().mul(c));
      }
      return f;
    }

    static unpack(f: Field): Bool[] {
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

    // TODO
    // static fromFields()
  }
  return PackedBool_;
}
