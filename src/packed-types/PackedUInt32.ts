import { Field, Provable, Struct, UInt32 } from 'snarkyjs';

export function PackedUInt32Factory(l: number) {
  class PackedUInt32_ extends Struct({
    values: Provable.Array(UInt32, l),
  }) {
    static l: number = l;

    constructor(values: UInt32[]) {
      super({ values });
    }

    toFields(): Field[] {
      let f = Field(0);
      for (let i = 0; i < l; i++) {
        const c = (2n ** 32n) ** BigInt(i);
        f = f.add(this.values[i].toBigint() * c);
      }
      return [f];
    }

    static unpack(packed: Field): UInt32[] {
      const ret = Provable.witness(Provable.Array(UInt32, l), () => {
        let uints: bigint[] = [];
        let packedN = packed.toBigInt();
        for (let i = 0; i < l; i++) {
          uints[i] = packedN & ((1n << 32n) - 1n);
          packedN >>= 32n;
        }
        return uints.map((x) => UInt32.from(x));
      });
      return ret;
    }
  }
  return PackedUInt32_;
}
