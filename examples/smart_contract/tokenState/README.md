## Using Tokens as State Smart Contract

Using o1js-pack, a token can actually be a packed value. Token balances are natively a `UInt64`, so there is not as much room as a full `Field`, but we can still pack 2 `UInt32`, or we could pack 8 characters, or 64 booleans.

The `mint` and `burn` mechanisms are used like an unspent transaction output system. The state going in is always burnt, and the state coming out is unrelated numerically. In the example in `run.ts`, the token balance is set to 5 when the state is (5, 0). But when the state is (5, 10), the token balance becomes 42949672965.

This can be useful for per-user state in a zkapp. Booleans could be used to track feature flags or whether or not a user account is active, in good standing, etc... Characters could be used to store shore strings on a per-user basis, perhaps a country code? UInts can be used like in this example to track the first and last time a user has used an app. Or you could use half of the state to track an actual user balance, and the other half to track another number like number of token transactions.
