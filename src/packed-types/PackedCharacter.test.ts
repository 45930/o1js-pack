import { Character } from 'snarkyjs';
import { PackedCharacterFactory } from './PackedCharacter';

describe('PackedCharacter', () => {
  it('packs and unpacks a string of length < 16', async () => {
    const myString = 'This is a test!';
    let myCharacters = [];
    for (let i = 0; i < myString.length; i++) {
      myCharacters.push(Character.fromString(myString[i]));
    }

    const PackedCharacter_15 = PackedCharacterFactory(15);

    const packedCharacter_15 = new PackedCharacter_15(
      PackedCharacter_15.pack(myCharacters),
      myCharacters
    );
    const f = packedCharacter_15.packed;
    const unpacked = PackedCharacter_15.unpack(f);

    const unpackedStr = unpacked.map((x) => x.toString()).join('');

    expect(unpackedStr).toBe(myString);
  });

  it('is one field in size', async () => {
    const myString = 'This is a test!';
    let myCharacters = [];
    for (let i = 0; i < myString.length; i++) {
      myCharacters.push(Character.fromString(myString[i]));
    }

    const PackedCharacter_15 = PackedCharacterFactory(15);

    expect(PackedCharacter_15.sizeInFields()).toBe(1);
  });

  it('throws for input >= 16 chars', () => {
    expect(() => PackedCharacterFactory(15)).not.toThrow();
    expect(() => PackedCharacterFactory(16)).toThrow();
  });
});
