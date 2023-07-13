import { Field, Provable, Struct, Bool } from 'snarkyjs';

export function PackedBoolFactory(l: number) {
  class PackedBool_ extends Struct({
    values: Provable.Array(Bool, l),
  }) {
    static l: number = l;

    constructor(values: Bool[]) {
      super({ values });
    }

    toFields(): Field[] {
      let f = Field(0);
      for (let i = 0; i < l; i++) {
        const c = (2n ** 1n) ** BigInt(i);
        if (this.values[i].toBoolean()) {
          f = f.add(1n * c);
        }
      }
      return [f];
    }

    static unpack(packed: Field): Bool[] {
      const ret = Provable.witness(Provable.Array(Bool, l), () => {
        let uints: bigint[] = [];
        let packedN = packed.toBigInt();
        for (let i = 0; i < l; i++) {
          uints[i] = packedN & ((1n << 1n) - 1n);
          packedN >>= 1n;
        }
        return uints.map((x) => Bool.fromJSON(Boolean(x)));
      });
      return ret;
    }
  }
  return PackedBool_;
}
