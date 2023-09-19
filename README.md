# o1js Pack

Make the most of your zkApp state!

## What is it

o1js Pack is a library for [O1JS](https://github.com/o1-labs/o1js/) that allows a zkApp developer to pack extra data into a single Field.

### Usage in a zkApp

```
import {
  PackedBoolFactory,
  PackedStringFactory,
  PackedUInt32Factory,
} from 'o1js-pack';

const MyPackedBools = PackedBoolFactory(); // Max of 254 Bools
const MyPackedString = PackedStringFactory(); // Max of 120 Characters
const MyPackedUInts = PackedUInt32Factory(); // Max of 7 UInt32s

const sevenUints = [1, 2, 3, 4, 5, 6, 7].map(x => UInt32.from(x));
const myPackedUInts = new MyPackedUInts(MyPackedUInts.pack(sevenUints), sevenUints);
```

## What's the catch?

If a zkApp has two or more independent Fields of state, then preconditions can be set on just one, or on any combination of the Fields. With o1js Pack, one precondition can be set on the packed Field, which means that independent updates cannot happen asynchronously.

For example, let's say there is a voting app with two independent Fields of state: `yesCount` and `noCount`. If one user issues an update to `yesCount` and another user issues an update to `noCount` at the same time, both proofs may be valid at the same time. Both transactions may succeed during the same block, since they don't interfere with each others' preconditions. With o1js Pack, a developer can save state by putting both `yesCount` and `noCount` into the same Field of state, making room for other states to exist on chain. The tradeoff is that two votes will no longer be able to be cast independently. `yesCount` and `noCount` depend on the same precontition, meaning that to update one or the other, you must lock both.

## How to build

```sh
npm run build
```

## How to run tests

```sh
npm run test src # non-proof tests
npm run testw # watch mode
```

## How to run coverage

```sh
npm run coverage
```

## Credits

Thanks to @mario_zito for seeding the idea for this library on Discord ([Thread 1](https://discord.com/channels/484437221055922177/1128509274465779822), [Thread 2](https://discord.com/channels/484437221055922177/1128501705173106698)), and to @gregor for sounding out the early implementation.

Thanks to @iam-dev for early adoption!

## License

[Apache-2.0](LICENSE)
