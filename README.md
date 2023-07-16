# SnarkyPack

Make the most of your ZKApp state!

## What is it

SnarkyPack is a library for [snarkyJS](https://github.com/o1-labs/snarkyjs/) that allows a zkapp developer to pack extra data into a single Field.

### Usage in a ZKApp

Example 1 - Use a pre-built type factory

```
import {
  PackedBoolFactory,
  PackedCharacterFactory,
  PackedUInt32Factory,
} from 'snarkyjs-pack';

const MyPackedBools = PackedBoolFactory(254); // Max of 254 Bools
const MyPackedCharacters = PackedCharacterFactory(15); // Max of 15 Characters
const MyPackedUInts = PackedUInt32Factory(7); // Max of 7 UInt32s

const sevenUints = [1, 2, 3, 4, 5, 6, 7].map(x => UInt32.from(x));
const myPackedUInts = new MyPackedUInts(MyPackedUInts.pack(sevenUints), sevenUints);
```

Example 2 - Use the packing plant to create your own packed type

```
import { PackingPlant } from 'snarkyjs-pack';

const SIZE_IN_BITS = 32n; // How large, in bits, the class you're packing is
const l = 7; // How many instances may be packed

// (SIZE_IN_BITS * l) cannot exceed 254

class MyPackedProvable extends PackingPlant(YourProvableType, l, SIZE_IN_BITS) {
  // Implement these
  static toAuxiliary();
  static pack();
}

const myPackedProvable = new MyPackedProvable(MyPackedProvable.pack(...), ...);
```

## What's the catch?

If a zkapp has two or more independent Fields of state, then preconditions can be set on just one, or on any combination of the Fields. With SnarkyPack, one precondition will be set on the packed Field, which means that independent updates cannot happen asynchronously.

For example, let's say there is a voting app with two independent Fields of state: `yesCount` and `noCount`. If one user issues an update to `yesCount` and another user issues an update to `noCount` at the same time, both proofs may be valid at the same time. Both transactions may succeed during the same block, since they don't interfere with each others' preconditions. With SnarkyPack, a devolper can save state by putting both `yesCount` and `noCount` into the same Field of state, making room for other state to exist on chain. The tradeoff is that two votes will no longer be able to be cast independently. `yesCount` and `noCount` depend on the same precontition, meaning that to update one or the other, you must lock both.

## How to build

```sh
npm run build
```

## How to run tests

```sh
npm run test
npm run testw # watch mode
```

## How to run coverage

```sh
npm run coverage
```

## License

[Apache-2.0](LICENSE)
