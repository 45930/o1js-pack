import { ZkProgram, SelfProof, Character, Provable } from 'o1js';
import { PackedStringFactory } from '../../src/lib/packed-types/PackedString';

export class TextInput extends PackedStringFactory() {}

export const TextInputProgram = ZkProgram({
  name: 'TextInputProgram',
  publicInput: TextInput,

  methods: {
    init: {
      privateInputs: [],
      async method(state: TextInput) {
        const initState = TextInput.fromString('Mina Protocol');
        state.assertEquals(initState);
      },
    },
    changeFirstLetter: {
      privateInputs: [SelfProof, Provable.Array(Character, 31), Character],
      async method(
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

export let TextInputProof_ = ZkProgram.Proof(TextInputProgram);
export class TextInputProof extends TextInputProof_ {}
