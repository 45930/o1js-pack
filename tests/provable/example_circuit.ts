import { Experimental, SelfProof } from 'o1js';
import { PackedUInt32 } from '../../src/lib/packed-types/PackedUInt32';

export class Votes extends PackedUInt32 {}

export const VotesProgram = Experimental.ZkProgram({
  publicInput: Votes,

  methods: {
    init: {
      privateInputs: [],
      method(state: Votes) {
        const initState = Votes.fromBigInts([0n, 0n]);
        state.assertEquals(initState);
      },
    },
    incrementIndex0: {
      privateInputs: [SelfProof],
      method(newState: Votes, oldProof: SelfProof<Votes, Votes>) {
        oldProof.verify();
        const expectedAux = Votes.unpack(oldProof.publicInput.packed);
        oldProof.publicInput.packed.assertEquals(
          Votes.fromUInt32s(expectedAux).packed
        );
        expectedAux[0] = expectedAux[0].add(1);
        newState.packed.assertEquals(Votes.fromUInt32s(expectedAux).packed);
      },
    },
    // incrementIndex1: {
    //   privateInputs: [SelfProof],
    //   method(newState: Votes, oldProof: SelfProof<Votes, Votes>) {
    //     oldProof.verify();
    //     const expectedAux = Votes.unpack(oldProof.publicInput.packed);
    //     expectedAux[1] = expectedAux[1].add(1);
    //     newState.packed.assertEquals(Votes.fromAuxiliary(expectedAux).packed);
    //   },
    // },
  },
});

export let VotesProof_ = Experimental.ZkProgram.Proof(VotesProgram);
export class VotesProof extends VotesProof_ {}
