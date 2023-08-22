import { Experimental, SelfProof } from 'snarkyjs';
import { PackedUInt32Factory } from '../../src/lib/packed-types/PackedUInt32';

export class Votes extends PackedUInt32Factory(2) {}

export const VotesProgram = Experimental.ZkProgram({
  publicInput: Votes,

  methods: {
    init: {
      privateInputs: [],
      method(state: Votes) {
        const initState = Votes.fromAuxiliary(Votes.fromBigInts([0n, 0n]).aux);
        state.assertEquals(initState);
      },
    },
    incrementIndex0: {
      privateInputs: [SelfProof],
      method(newState: Votes, oldProof: SelfProof<Votes, Votes>) {
        oldProof.verify();
        const expectedAux = Votes.unpack(oldProof.publicInput.packed);
        expectedAux[0] = expectedAux[0].add(1);
        newState.packed.assertEquals(Votes.fromAuxiliary(expectedAux).packed);
      },
    },
    incrementIndex1: {
      privateInputs: [SelfProof],
      method(newState: Votes, oldProof: SelfProof<Votes, Votes>) {
        oldProof.verify();
        const expectedAux = Votes.unpack(oldProof.publicInput.packed);
        expectedAux[1] = expectedAux[1].add(1);
        newState.assertEquals(Votes.fromAuxiliary(expectedAux));
      },
    },
  },
});

export let VotesProof_ = Experimental.ZkProgram.Proof(VotesProgram);
export class VotesProof extends VotesProof_ {}
