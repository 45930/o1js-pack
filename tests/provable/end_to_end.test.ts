import { UInt32 } from 'o1js';
import { Votes, VotesProgram, VotesProof } from './example_circuit';

describe('End to End Votes Test', () => {
  const initVotesAux = [0n, 0n];
  const initVotes = Votes.fromBigInts(initVotesAux);
  let initProof: VotesProof;

  beforeAll(async () => {
    await VotesProgram.compile();
    initProof = await VotesProgram.init(initVotes);
    initProof.verify();
  });

  describe('Incrementing votes', () => {
    // let initProof: VotesProof;
    beforeAll(async () => {
      // initProof = await VotesProgram.init(initVotes);
    });

    it('Increments the 0th index', async () => {
      const proofAux = [1n, 0n];
      const proofVotes = Votes.fromAuxiliary(Votes.fromBigInts(proofAux).aux);
      const proof = await VotesProgram.incrementIndex0(proofVotes, initProof);
      proof.verify();
      proofVotes.packed.assertEquals(proof.publicInput.packed);
    });

    // it('Increments the 1st index', async () => {
    //   const proofAux = [UInt32.from(0), UInt32.from(1)];
    //   const proofVotes = Votes.fromAuxiliary(proofAux);
    //   const proof = await VotesProgram.incrementIndex1(proofVotes, initProof);
    //   proof.verify();
    //   proofVotes.packed.assertEquals(proof.publicInput.packed);
    // })

    // it('throws when verifying an invalid proof', async () => {
    //   const proofAux = [UInt32.from(0), UInt32.from(1)];
    //   const proofVotes = Votes.fromAuxiliary(proofAux);
    //   const proof = await VotesProgram.incrementIndex1(proofVotes, initProof);
    //   try {
    //     proof.verify();
    //     expect(0).toBe(1);
    //   } catch (e) {
    //     console.log(e);
    //   }
    // })
  });
});
