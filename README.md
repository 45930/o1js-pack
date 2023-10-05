# o1js Pack

Make the most of your zkApp state!

## What is it

o1js Pack is a library for [o1js](https://github.com/o1-labs/o1js/) that allows a zkApp developer to pack extra data into a single Field.

### Usage in a zkApp

### Smart Contract

The primary benefit of using this library in a smart contract is that it allows you to use more of your allotted 8 Fields of storage.

Check out example usage in a smart contract in [Smart Contract Examples](/examples/smart_contract/).

### ZK Program

The benefit to using this library in a zk program is less obvious. In some cases, the number of gates required in a circuit is less using this library than with provable arrays. Especially in applications where the array is hashed many times, packing and unpacking ends up being more effecient than doing a lot of Poseidon hashes. In other cases, you may just prefer the API of o1js Pack compared to using provable arrays.

Check out example usage in a zk program in [Zk Program Examples](/examples/zk_program/).

## How to build

```sh
npm run build
```

## How to run tests

```sh
npm run test src # non-proof tests
npm run test tests/provable # provable tests
```

## Credits

Thanks to @mario_zito for seeding the idea for this library on Discord ([Thread 1](https://discord.com/channels/484437221055922177/1128509274465779822), [Thread 2](https://discord.com/channels/484437221055922177/1128501705173106698)), and to @gregor for sounding out the early implementation.

Thanks to @iam-dev for early adoption!

## License

[Apache-2.0](LICENSE)
