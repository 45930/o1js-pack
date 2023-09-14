import {
  Experimental,
  SelfProof,
  Character,
  Poseidon,
  Provable,
  Field,
} from 'o1js';
import { PackedStringFactory } from '../../src/lib/packed-types/PackedString';

const MAX_LENGTH = 32;
export class TextInput extends PackedStringFactory(MAX_LENGTH) {}

export const TextInputProgram = Experimental.ZkProgram({
  publicInput: TextInput,

  methods: {
    init: {
      privateInputs: [],
      method(state: TextInput) {
        const initState = TextInput.fromString('Mina Protocol');
        for (let x = 0; x < TextInput.n; x++) {
          state.packed[x].assertEquals(initState.packed[x]);
        }
      },
    },
    changeFirstLetter: {
      privateInputs: [SelfProof, Character],
      method(
        newState: TextInput,
        oldProof: SelfProof<TextInput, TextInput>,
        newInput: Character
      ) {
        oldProof.verify();
        let expectedUnpacked = TextInput.unpack(oldProof.publicInput.packed);
        const repacked = TextInput.fromCharacters(expectedUnpacked);
        repacked.assertEquals(oldProof.publicInput);
        expectedUnpacked[0] = newInput;
        const repacked2 = TextInput.fromCharacters(expectedUnpacked);
        newState.assertEquals(repacked2);
      },
    },
  },
});

export let TextInputProof_ = Experimental.ZkProgram.Proof(TextInputProgram);
export class TextInputProof extends TextInputProof_ {}
