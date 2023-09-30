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
        const unpacked = Votes.unpack(oldProof.publicInput.packed);
        unpacked[0] = unpacked[0].add(1);
        newState.assertEquals(Votes.fromUInt32s(unpacked));
      },
    },
    incrementIndex1: {
      privateInputs: [SelfProof],
      method(newState: Votes, oldProof: SelfProof<Votes, Votes>) {
        oldProof.verify();
        const unpacked = Votes.unpack(oldProof.publicInput.packed);
        unpacked[1] = unpacked[1].add(1);
        newState.assertEquals(Votes.fromUInt32s(unpacked));
      },
    },
  },
});

export let VotesProof_ = Experimental.ZkProgram.Proof(VotesProgram);
export class VotesProof extends VotesProof_ {}
