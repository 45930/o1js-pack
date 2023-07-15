# SnarkyPack

Make the most of your ZKApp state!

## What is it

SnarkyPack is a library for [snarkyJS](https://github.com/o1-labs/snarkyjs/) that allows a zkapp developer to pack extra data into a single Field. Currently the following use cases are supported:

- Packing 1-7 `UInt32`s into a Field
- Packing 1-254 `Bool`s into a Field

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
