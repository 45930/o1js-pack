import {
  Field,
  Experimental,
  UInt32,
  Provable,
  Poseidon,
  SelfProof,
  Character,
  Bool,
  Empty,
} from 'o1js';
import {
  PackedUInt32Factory,
  PackedStringFactory,
} from '../../../src/index.js';

export class PackedCounters extends PackedUInt32Factory(2) {}

export class PackedString extends PackedStringFactory(8) {}

const isOlderThan = (reference: PackedString, toVerify: PackedString): Bool => {
  let ref = Field(0);
  let ver = Field(0);

  const referenceDate = PackedString.unpack(reference.packed);
  const dateToVerify = PackedString.unpack(toVerify.packed);

  for (let i = 0; i < PackedString.l; i++) {
    const exp = PackedString.l - i;
    ref = ref.add(referenceDate[i].value.mul(10 ** exp));
    ver = ver.add(dateToVerify[i].value.mul(10 ** exp));
  }

  return ver.greaterThan(ref);
};

export const AgeGateCircuit = Experimental.ZkProgram({
  publicOutput: PackedCounters,

  methods: {
    init: {
      privateInputs: [],
      method() {
        return PackedCounters.fromBigInts([0n, 0n]);
      },
    },
    verifyAge: {
      privateInputs: [SelfProof, PackedString],
      method(
        oldProof: SelfProof<Empty, PackedCounters>,
        dateToVerify: PackedString
      ) {
        oldProof.verify();
        const counters = PackedCounters.unpack(oldProof.publicOutput.packed);
        const referenceDate = PackedString.fromString('20000101'); // hard-coded - date to verify must be older than new years in the year 2000
        const isOlder = isOlderThan(referenceDate, dateToVerify);
        const deltaCounter0 = Provable.if(
          isOlder,
          UInt32.from(1),
          UInt32.from(0)
        );
        const deltaCounter1 = Provable.if(
          isOlder,
          UInt32.from(0),
          UInt32.from(1)
        );
        counters[0] = counters[0].add(deltaCounter0);
        counters[1] = counters[1].add(deltaCounter1);
        return PackedCounters.fromUInt32s(counters);
      },
    },
  },
});

export const AgeGateCircuitProof = Experimental.ZkProgram.Proof(AgeGateCircuit);
