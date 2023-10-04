import {
  Experimental,
  SelfProof,
  Character,
  Poseidon,
  Provable,
  Field,
} from 'o1js';
import { MultiPackedStringFactory } from '../../src/lib/packed-types/PackedString';

const MAX_LENGTH = 32;
export class TextInput extends MultiPackedStringFactory(MAX_LENGTH) {}

export const TextInputProgram = Experimental.ZkProgram({
  publicInput: TextInput,

  methods: {
    init: {
      privateInputs: [],
      method(state: TextInput) {
        const initState = TextInput.fromString('Mina Protocol');
        state.assertEquals(initState);
      },
    },
    changeFirstLetter: {
      privateInputs: [
        SelfProof,
        Provable.Array(Character, MAX_LENGTH),
        Character,
      ],
      method(
        newState: TextInput,
        oldProof: SelfProof<TextInput, TextInput>,
        oldCharacters: Array<Character>,
        newInput: Character
      ) {
        oldProof.verify();
        const newCharacters = [
          ...oldCharacters.map((x) => new Character(x.value)),
        ];
        const packed = TextInput.fromCharacters(oldCharacters);
        packed.assertEquals(oldProof.publicInput);
        newCharacters[0] = newInput;
        const repacked = TextInput.fromCharacters(newCharacters);
        newState.assertEquals(repacked);
      },
    },
  },
});

export let TextInputProof_ = Experimental.ZkProgram.Proof(TextInputProgram);
export class TextInputProof extends TextInputProof_ {}
