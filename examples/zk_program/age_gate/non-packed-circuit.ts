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
  CircuitString,
} from 'o1js';

const isOlderThan = (
  reference: CircuitString,
  toVerify: CircuitString
): Bool => {
  let ref = Field(0);
  let ver = Field(0);

  for (let i = 0; i < 8; i++) {
    const exp = 8 - i;
    ref = ref.add(reference.values[i].value.mul(10 ** exp));
    ver = ver.add(toVerify.values[i].value.mul(10 ** exp));
  }

  return ver.greaterThan(ref);
};

export const AgeGateCircuit = Experimental.ZkProgram({
  publicOutput: Provable.Array(UInt32, 2),

  methods: {
    init: {
      privateInputs: [],
      method() {
        return [UInt32.from(0), UInt32.from(0)];
      },
    },
    verifyAge: {
      privateInputs: [SelfProof, CircuitString],
      method(
        oldProof: SelfProof<Empty, Array<UInt32>>,
        dateToVerify: CircuitString
      ) {
        oldProof.verify();
        const counters = oldProof.publicOutput;
        const referenceDate = CircuitString.fromString('20000101'); // hard-coded - date to verify must be older than new years in the year 2000
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
        return counters;
      },
    },
  },
});

export const AgeGateCircuitProof = Experimental.ZkProgram.Proof(AgeGateCircuit);
