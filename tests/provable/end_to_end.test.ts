import { Votes, VotesProgram, VotesProof } from './example_packed_uint_circuit';
import {
  TextInput,
  TextInputProgram,
  TextInputProof,
} from './example_packed_string_circuit';
import { Character, Poseidon } from 'o1js';

describe('End to End Votes Test', () => {
  const init = [0n, 0n];
  const initVotes = Votes.fromBigInts(init);
  let initProof: VotesProof;

  beforeAll(async () => {
    await VotesProgram.compile();
    initProof = await VotesProgram.init(initVotes);
    initProof.verify();
  });

  describe('Incrementing votes', () => {
    it('Increments the 0th index', async () => {
      const unpackedVotes = [1n, 0n];
      const proofVotes = Votes.fromBigInts(unpackedVotes);
      const proof = await VotesProgram.incrementIndex0(proofVotes, initProof);
      proof.verify();
      proofVotes.packed.assertEquals(proof.publicInput.packed);
    });

    // Temporarily skipping, the proof does not verify, but the behavior does not match #toThrow
    it.skip('throws when verifying an invalid proof', async () => {
      const unpackedVotes = [1n, 0n];
      const proofVotes = Votes.fromBigInts(unpackedVotes);
      const proof = await VotesProgram.incrementIndex1(proofVotes, initProof);
      expect(() => {
        proof.verify();
      }).toThrow();
    });
  });
});

describe('End to End Text Input Test', () => {
  const init = 'Mina Protocol';
  const initTextInput = TextInput.fromString(init);
  let initProof: TextInputProof;

  beforeAll(async () => {
    await TextInputProgram.compile();
    initProof = await TextInputProgram.init(initTextInput);
    initProof.verify();
  });

  describe('Adding Input', () => {
    it('adds input', async () => {
      let unpackedTextInput = 'Zina Protocol';
      let proofTextInput = TextInput.fromString(unpackedTextInput);
      const p1 = await TextInputProgram.changeFirstLetter(
        proofTextInput,
        initProof,
        TextInput.unpack(initProof.publicInput.packed),
        Character.fromString('Z')
      );
      proofTextInput.assertEquals(p1.publicInput);
    });
  });
});
