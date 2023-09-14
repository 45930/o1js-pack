import { Experimental, SelfProof } from 'o1js';
import { PackedUInt32Factory } from '../../src/lib/packed-types/PackedUInt32';

export class Votes extends PackedUInt32Factory() {}

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
        const expectedUnpacked = Votes.unpack(oldProof.publicInput.packed);
        oldProof.publicInput.packed.assertEquals(
          Votes.fromUInt32s(expectedUnpacked).packed
        );
        expectedUnpacked[0] = expectedUnpacked[0].add(1);
        newState.assertEquals(Votes.fromUInt32s(expectedUnpacked));
      },
    },
    incrementIndex1: {
      privateInputs: [SelfProof],
      method(newState: Votes, oldProof: SelfProof<Votes, Votes>) {
        oldProof.verify();
        const expectedUnpacked = Votes.unpack(oldProof.publicInput.packed);
        oldProof.publicInput.packed.assertEquals(
          Votes.fromUInt32s(expectedUnpacked).packed
        );
        expectedUnpacked[1] = expectedUnpacked[1].add(1);
        newState.assertEquals(Votes.fromUInt32s(expectedUnpacked));
      },
    },
  },
});

export let VotesProof_ = Experimental.ZkProgram.Proof(VotesProgram);
export class VotesProof extends VotesProof_ {}
