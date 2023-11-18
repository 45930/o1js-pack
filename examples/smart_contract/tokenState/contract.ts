import {
  SmartContract,
  state,
  State,
  method,
  UInt32,
  UInt64,
  Account,
  Provable,
} from 'o1js';
import { PackedUInt32Factory } from '../../../src/index.js';

/**
 * 2 UInt32s representing the first-joined block and the last-updated block
 * Could be used in conjunction with some other app logic to ensure only active users can access some resource, or similar
 */
export class UserBlockStamps extends PackedUInt32Factory(2) {}

export class UserBlockStampsToken extends SmartContract {
  /**
   * Initializes the user state by setting the first-joined blockstamp to the current blockheight
   */
  @method
  joinSystem() {
    const account = Account(this.sender, this.token.id);
    const currentTokenBalance = account.balance.getAndAssertEquals();
    currentTokenBalance.assertEquals(UInt64.from(0));

    const userBlockStamps = UserBlockStamps.fromUInt32s([
      this.network.blockchainLength.getAndAssertEquals(),
      UInt32.from(0),
    ]);
    this.token.mint({
      address: this.sender,
      amount: UInt64.from(userBlockStamps.packed),
    });
  }

  /**
   * Updates the user state by setting the last-updated blockstamp to the current blockheight
   */
  @method
  interactWithSystem() {
    const account = Account(this.sender, this.token.id);
    const currentTokenBalance = account.balance.getAndAssertEquals();
    const existingUserBlockstamps = UserBlockStamps.unpack(
      currentTokenBalance.value
    );

    this.token.burn({
      address: this.sender,
      amount: currentTokenBalance,
    });

    existingUserBlockstamps[1] =
      this.network.blockchainLength.getAndAssertEquals();
    this.token.mint({
      address: this.sender,
      amount: UInt64.from(UserBlockStamps.pack(existingUserBlockstamps)),
    });
  }
}
